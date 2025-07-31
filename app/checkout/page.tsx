"use client";

import React, { Suspense } from "react";

import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <Suspense fallback={<div>Loading checkout...</div>}>
        <BookingCheckoutPage />
      </Suspense>
    </div>
  );
}
