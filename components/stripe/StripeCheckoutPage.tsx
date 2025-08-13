"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { CircleAlert, Lock } from "lucide-react";
import StyledAsButton from "@/components/StyledAsButton";
import { useApiMutation } from "@/lib/api-client";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import combineDateAndTimeToUTC from "@/utils/time/combineDateAndTimeToUTC";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type CheckoutOutFormType = {
  clientSecret: string;
};

type BookingResponse = {
  special_instructions: string;
  start_time: string;
  customer_id: string;
  address_id: string;
  created_at: string;
  updated_at: string;
  service_notes: string;
  status: string;
  id: string;
  provider_id: string;
  service_id: string;
};

type BookingRequestPayload = {
  stripe_payment_id: string;
  service_notes?: string;
  service_id: string;
  provider_id: string;
  address_id: string;
  start_time: string;
  special_instructions: string;
};

function CheckoutForm({ clientSecret }: CheckoutOutFormType) {
  const { booking } = useBooking();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [cardholderError, setCardholderError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createBooking, error } = useApiMutation<
    BookingResponse,
    BookingRequestPayload
  >("/bookings", "POST");

  // ############################ HANDLE SUBMIT FOR PAYMENTS #####################################

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    if (error) {
      setLoading(false);
      setMessage(
        "An error occured when processing your payment! The useApiMutation hook failed",
      );
    }

    setLoading(true);
    setMessage("processing your payment");

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

    if (result.paymentIntent?.status === "succeeded") {
      setMessage("Payment was successful!");

      // ########################## CREATE BOOKING ###################
      const hasDateAndTime = booking.date && booking.time;
      const hasAvailableTime = booking.availableTime;

      if (
        !result.paymentIntent.id ||
        !booking.serviceId ||
        !booking.providerId ||
        // !booking.addressId ||
        !(hasDateAndTime || hasAvailableTime)
      ) {
        console.log(
          `missing required data to create booking result.paymentIntent.id ${result.paymentIntent.id} booking.serviceId ${booking.serviceId}  booking.providerId ${booking.providerId} booking.date ${booking.date} booking.time
     ${booking.time} booking.addressId ${booking.addressId} `,
        );
        return;
      }

      const convertAvailableTimeToUTC = function (localTime: string) {
        let utcTime = "";
        if (localTime) {
          utcTime = new Date(localTime).toISOString();
        }
        return utcTime;
      };
      createBooking(
        {
          stripe_payment_id: result.paymentIntent.id,
          service_id: booking.serviceId,
          provider_id: booking.providerId,
          start_time: hasDateAndTime
            ? combineDateAndTimeToUTC(booking.date!, booking.time!)
            : convertAvailableTimeToUTC(booking.availableTime || ""),
          service_notes: "",
          special_instructions: booking.serviceNotes || "",
          address_id:
            booking.addressId || "78a96f8c-507e-4a30-8a3e-ac019ef4808a",
        },
        {
          onSuccess: (data) => {
            const bookingId = data.id;
            setMessage("Booking successfully created!");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            router.push(`/booking-confirmation/${bookingId}`);
          },
          onError: (err) => {
            setMessage("There was an error creating your booking");
            console.error("Booking failed:", err.message);
          },
          onSettled: () => {
            setLoading(false);
          },
        },
      );
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
        <div className="text-green-600 mb-4 font-semibold">{message}</div>
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

type StripeCheckoutPageType = {
  couponCode: string;
};
export default function StripeCheckoutPage({
  couponCode,
}: StripeCheckoutPageType) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPaymentSectionMessage, setLoadingPaymentSectionMessage] =
    useState<string | null>("loading payment section ...");

  const { booking } = useBooking();

  const { serviceId } = booking;

  const { mutate: createPaymentIntent } = useApiMutation<
    { client_secret: string },
    { service_id: string; discount_code?: string }
  >("/stripe/create-payment-intent", "POST");

  const handleCreatePaymentIntent = () => {
    if (!serviceId) {
      return;
    }
    createPaymentIntent(
      { service_id: serviceId, discount_code: couponCode },
      {
        onSuccess: (responseData) => {
          setClientSecret(responseData.client_secret);

          setLoadingPaymentSectionMessage(null);
          console.log("clientSecret", clientSecret);
        },
        onError: (err) => {
          setLoadingPaymentSectionMessage(
            "There was an error with loading the stripe payment section! Payment intent creation failed. Please refresh the page",
          );
          console.error("Booking failed:", err.message);
        },
        onSettled: () => {},
      },
    );
  };

  useEffect(() => {
    if (serviceId) {
      handleCreatePaymentIntent();
    } else {
      setLoadingPaymentSectionMessage(
        "There was an error with loading the stripe payment section! No service Id was found",
      );
    }
  }, [serviceId, couponCode]);

  if (loadingPaymentSectionMessage || !clientSecret) {
    return (
      <div className="p-10 text-center">{loadingPaymentSectionMessage}</div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
