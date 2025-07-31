import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import Checkout from "@/components/stripe/Checkout";
import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";

export default function StripeCheckoutPage() {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }
  const searchParams = useSearchParams();
  const serviceCost = Number(searchParams.get("servicecost") || "65");
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(serviceCost),
        currency: "usd",
      }}
    >
      <Checkout amount={convertToSubcurrency(serviceCost)} />
    </Elements>
  );
}
