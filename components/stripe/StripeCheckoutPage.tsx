"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { CircleAlert, Lock } from "lucide-react";
import StyledAsButton from "@/components/StyledAsButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type CheckoutOutFormType = {
  clientSecret: string;
};
function CheckoutForm({ clientSecret }: CheckoutOutFormType) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>();
  const [cardholderError, setCardholderError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(undefined);

    if (!cardholderName.trim()) {
      setCardholderError("Cardholder name is required.");
      setLoading(false);
      return;
    }
    setCardholderError("");

    if (!stripe || !elements) {
      setMessage("Stripe.js has not loaded yet.");
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setMessage("Card element not found.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    }

    const bookingid = "19eb6a08-5e86-4420-ae28-b6c4435f6238";
    if (result.paymentIntent?.status === "succeeded") {
      setMessage("Payment was successful!");

      const bookingResult = await fetch(
        "https://maidyoulook-backend.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_intent_id: result.paymentIntent.id,
            // booking information
          }),
        },
      ).then((res) => res.json());

      // https://github.com/dsd-cohort-team-corgi/backend/issues/37
      if (bookingResult) {
        window.location.href = `/booking-confirmation/${bookingid}`;
        setMessage("Booking successfully created!");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-md">
      <section className="rounded-xl border-1 border-light-accent bg-white p-6">
        <div className="my-auto flex max-w-4xl rounded-md bg-white py-4">
          <Lock color="green" size={24} />
          <h2 className="pl-2 text-xl font-semibold">Secure Payment </h2>
        </div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="mb-4 block">
          <span>Card Number</span>
          <div className="mt-1 rounded border border-gray-300 p-3">
            <CardNumberElement options={{ showIcon: true }} />
          </div>
        </label>

        <div className="mb-4 flex gap-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex-1">
            <span> Expiry Date</span>
            <div className="mt-1 rounded border border-gray-300 p-3">
              <CardExpiryElement />
            </div>
          </label>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex-1">
            <span> CVC</span>
            <div className="mt-1 rounded border border-gray-300 p-3">
              <CardCvcElement />
            </div>
          </label>
        </div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="block">
          <span> Cardholder Name</span>

          <div className="mt-1 rounded border border-gray-300 p-3">
            <input
              type="text"
              className="w-full"
              name="customername"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                if (cardholderError) setCardholderError(""); // Clear error on input
              }}
            />
          </div>
          {cardholderError && (
            <p className="mt-1 text-sm text-red-600">{cardholderError}</p>
          )}
        </label>

        <section className="mx-auto mt-6 flex max-w-4xl rounded-md bg-blue-50 p-4 text-blue-800">
          <CircleAlert color="#2563eb" size={30} />
          <div className="pl-3">
            <h4 className="font-semibold">Payment Protection</h4>
            <p>
              Your payment is processed securely by Stripe. You&apos;ll be
              charged when the service is completed.
            </p>
          </div>
        </section>
      </section>

      {message && !message.includes("success") && (
        <div className="mb-4 font-semibold text-red-600">{message}</div>
      )}

      {message && message.includes("success") && (
        <div className="mb-4 font-semibold text-green-600">{message}</div>
      )}

      <StyledAsButton
        type="submit"
        disabled={!stripe || loading}
        className="mx-auto my-20 flex w-full max-w-lg rounded-3xl bg-blue-500 p-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        label={!loading ? `Confirm and Pay Bill` : "Processing..."}
      />
    </form>
  );
}

export default function StripeCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(true);

  const searchParams = useSearchParams();
  const serviceId =
    searchParams.get("serviceid") || "24afade0-1c79-4831-9bf4-7c0c5bbd0f66";
  // default backup is the service id for decluttering

  useEffect(() => {
    const createIntent = async () => {
      if (!serviceId) {
        return;
      }
      try {
        const res = await fetch(
          "https://maidyoulook-backend.onrender.com/stripe/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id: serviceId }),
          },
        );

        const data = await res.json();
        setClientSecret(data.client_secret);
      } catch (err) {
        console.error("Failed to create payment intent:", err);
      } finally {
        setLoadingIntent(false);
      }
    };

    createIntent();
  }, [serviceId]);

  if (loadingIntent || !clientSecret) {
    return <div className="p-10 text-center">Loading checkout...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
