"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";
import StarRatingReview from "../ProviderOverallRatingInfo";
import IconLeftTwoTextRight from "../IconLeftTwoTextRight";

export default function BookingCheckoutPage() {
  const searchParams = useSearchParams();
  const providerName = searchParams.get("providername") || "Green Thumb Pros";
  const date = searchParams.get("date") || "Monday, July 15th, 2025";
  const time = searchParams.get("time") || "11:00 AM";
  const location =
    searchParams.get("location") || "123 Main St, San Francisco, CA 94102";
  const service = searchParams.get("service") || "Lawn Mowing";
  const serviceDuration = searchParams.get("serviceduration") || "60 minutes";
  const serviceCost = searchParams.get("servicecost") || "65";

  return (
    <section className="mb-10">
      <div className="rounded-lg border-1 border-light-accent bg-white p-4">
        <h1 className="mb-4 text-xl font-bold">Booking Details</h1>
        <h2 className="mb-3 text-3xl font-bold"> {providerName} </h2>
        <StarRatingReview />
        <div className="my-8">
          <IconLeftTwoTextRight
            icon={Calendar}
            heading="Event Date"
            text={date}
          />
          <IconLeftTwoTextRight icon={Clock} heading="Time" text={time} />
          <IconLeftTwoTextRight
            icon={MapPin}
            heading="Location"
            text={location}
          />
        </div>
        <div className="flex items-center">
          <div className="mx-4 h-[2px] grow bg-light-accent" />
        </div>
        <section className="mt-5 flex justify-between">
          <div>
            <span className="block font-semibold"> {service}</span>
            <span className="block text-sm text-secondary-font-color">
              {serviceDuration}
            </span>
          </div>
          <span className="font-semibold"> {`${serviceCost}`} </span>
        </section>
      </div>

      <div className="mt-6 flex flex-col justify-center rounded-lg border-1 border-light-accent bg-white px-2 py-8">
        <h4 className="mb-2 ml-4 text-lg font-bold">
          {" "}
          Special Instructions (Optional){" "}
        </h4>

        <textarea
          className="mx-auto w-[96%] resize-none rounded-lg border-1 border-light-accent p-2"
          placeholder="Any specific requests or instructions for the provider (e.g. 'Don't ring the doorbell', 'gate code is 1234',etc.)"
          rows={4}
        />
      </div>
    </section>
  );
}
