"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "@/components/stripe/Checkout";
import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";
import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function page() {
  const amount = 49.99;
  return (
    <div className="mx-auto max-w-4xl">
      <BookingCheckoutPage />
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <Checkout amount={amount} />
      </Elements>
    </div>
  );
}
