"use client";

import React, { Suspense, useState } from "react";

import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";
import StripeCheckoutPage from "@/components/stripe/StripeCheckoutPage";

export default function Page() {
  const [couponCode, setCouponCode] = useState("");
  return (
    <div className="mx-auto max-w-4xl w-[90%]">
      <Suspense fallback={<div>Loading checkout...</div>}>
        <BookingCheckoutPage
          setCouponCode={setCouponCode}
          couponCode={couponCode}
        />
        <StripeCheckoutPage couponCode={couponCode} />
      </Suspense>
    </div>
  );
}
