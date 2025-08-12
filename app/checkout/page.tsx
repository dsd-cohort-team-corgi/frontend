"use client";

import React, { Suspense, useState } from "react";

import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";
import StripeCheckoutPage from "@/components/stripe/StripeCheckoutPage";

export default function Page() {
  const [discountCode, setDiscountCode] = useState("");
  return (
    <div className="mx-auto max-w-4xl">
      <Suspense fallback={<div>Loading checkout...</div>}>
        <BookingCheckoutPage
          setDiscountCode={setDiscountCode}
          discountCode={discountCode}
        />
        <StripeCheckoutPage discountCode={discountCode} />
      </Suspense>
    </div>
  );
}
