"use client";

import React, { useEffect, useState } from "react";

import { CircleAlert, Lock } from "lucide-react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";
import StyledAsButton from "../StyledAsButton";

const CheckoutPage = function ({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent-stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js has not loaded yet.");
      setLoading(false);
      return;
    }

    // Optional: submit elements to validate inputs before confirming
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

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
            <input type="text" className="w-full" />
          </div>
        </label>

        {errorMessage && (
          <div className="mb-4 font-semibold text-red-600">{errorMessage}</div>
        )}
        <section className="mx-auto mt-6 flex max-w-4xl rounded-md bg-blue-50 p-4 text-blue-800">
          <CircleAlert color="#2563eb" size={30} />
          <div className="pl-3">
            <h4 className="font-semibold">Payment Protection</h4>
            <p>
              {" "}
              Your payment is processes securely by Stripe. You&apos;ll be
              charged when the service is completed
            </p>
          </div>
        </section>
      </section>
      <StyledAsButton
        type="submit"
        disabled={!stripe || loading}
        className="mx-auto my-20 flex w-full max-w-lg rounded-3xl bg-blue-500 p-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        label={!loading ? `Confirm and Pay Bill` : "Processing..."}
        // flex because it automatically comes with an inline-flex button, changing it to flex will allow it to be centered
      />
    </form>
  );
};

export default CheckoutPage;
