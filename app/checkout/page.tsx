"use client";

import React, { Suspense, useState } from "react";

import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";
import StripeCheckoutPage from "@/components/stripe/StripeCheckoutPage";

export default function Page() {
  const [serviceNotes, setServiceNotes] = useState<undefined | string>();
  return (
    <div className="mx-auto max-w-4xl">
      <Suspense fallback={<div>Loading checkout...</div>}>
        <BookingCheckoutPage
          setServiceNotes={setServiceNotes}
          serviceNotes={serviceNotes}
        />
        <StripeCheckoutPage serviceNotes={serviceNotes} />
      </Suspense>
    </div>
  );
}
