"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "@/components/stripe/Checkout";
import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";
import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Page() {
  const amount = 49.99;
  const searchParams = useSearchParams();
  const providerName = searchParams.get("providername") || "Green Thumb Pros";
  const date = searchParams.get("date") || "Monday, July 15th, 2025";
  const time = searchParams.get("time") || "11:00 AM";
  const location =
    searchParams.get("location") || "123 Main St, San Francisco, CA 94102";
  const service = searchParams.get("service") || "Lawn Mowing";
  const serviceDuration = searchParams.get("serviceduration") || "60 minutes";
  const serviceCost = searchParams.get(" servicecost") || "65";

  return (
    <div className="mx-auto max-w-4xl">
      <BookingCheckoutPage
        providerName={providerName}
        date={date}
        time={time}
        location={location}
        service={service}
        serviceDuration={serviceDuration}
        serviceCost={serviceCost}
      />
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <Checkout amount={convertToSubcurrency(Number(serviceCost))} />
      </Elements>
    </div>
  );
}
