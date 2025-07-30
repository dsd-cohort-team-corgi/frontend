import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import StarRatingReview from "../ProviderOverallRatingInfo";
import IconLeftTwoTextRight from "../IconLeftTwoTextRight";

export default function BookingCheckoutPage() {
  return (
    <section className="mb-10">
      <div className="rounded-lg border-1 border-light-accent bg-white p-4">
        <h1 className="mb-4 text-xl font-bold">Booking Details</h1>
        <h2 className="mb-3 text-3xl font-bold"> Provider Name </h2>
        <StarRatingReview />
        <div className="my-10">
          <IconLeftTwoTextRight
            icon={Calendar}
            heading="Event Date"
            text="July 30, 2025"
          />
          <IconLeftTwoTextRight icon={Clock} heading="Time" text="11:00 AM" />
          <IconLeftTwoTextRight
            icon={MapPin}
            heading="Location"
            text="123 Main St, San Francisco, CA 94102"
          />
        </div>
        <div className="flex items-center">
          <div className="mx-4 h-px flex-grow bg-gray-300" />
        </div>
        <section className="mt-5 flex justify-between">
          <div>
            <span className="block font-semibold"> Lawn Mowing</span>
            <span className="block text-sm text-secondary-font-color">
              {" "}
              60 minutes
            </span>
          </div>
          <span className="font-semibold"> $65</span>
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
