import React from "react";
import { Calendar } from "lucide-react";
import StarRatingReview from "../ProviderOverallRatingInfo";

export default function BookingCheckoutPage() {
  return (
    <section className="">
      <div className="rounded-lg border-1 border-light-accent bg-white p-4">
        <h1 className="text-xl font-bold">Booking Details</h1>
        <h2 className="text-3xl font-bold"> Provider Name </h2>
        <StarRatingReview />
        <div className="flex items-center rounded-xl py-2 pl-2">
          <Calendar color="blue" />
          <div className="pl-2">
            <span className="block">Date </span>
            <span className="block"> blah blah blah </span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white">
        <h4 className="text-lg font-bold"> Special Instructions (Optional) </h4>
        <textarea className="mx-4 w-full rounded-lg border-1 border-light-accent" />
      </div>
    </section>
  );
}
