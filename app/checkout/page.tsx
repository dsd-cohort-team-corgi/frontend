"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import BookingCheckoutPage from "@/components/stripe/BookingCheckoutPage";

export default function Page() {
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
    </div>
  );
}
