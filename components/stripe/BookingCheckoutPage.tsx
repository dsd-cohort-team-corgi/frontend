"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import StarRatingReview from "../ProviderOverallRatingInfo";
import IconLeftTwoTextRight from "../IconLeftTwoTextRight";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import { getAuthHeaders } from "@/lib/api-client";

export default function BookingCheckoutPage() {
  const searchParams = useSearchParams();
  const location =
    searchParams.get("location") || "123 Main St, San Francisco, CA 94102";

  const { booking, updateBooking } = useBooking();

  useEffect(() => {
    async function fetchCustomerId() {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `https://maidyoulook-backend.onrender.com/customers/me`,
        { headers },
      );
      if (!res.ok) {
        console.error("failed to fetch users data");
        return;
      }
      const data = await res.json();
      const userId = data.id;
      updateBooking({ customerId: userId });
    }
    fetchCustomerId();
  }, []);

  return (
    <section className="mb-10">
      <div className="rounded-lg border-1 border-light-accent bg-white p-4">
        <h1 className="mb-4 text-xl font-bold">Booking Details</h1>
        <h2 className="mb-3 text-3xl font-bold">
          {booking.companyName
            ? booking.companyName
            : `${booking.firstName} ${booking.lastName}`}
        </h2>
        <StarRatingReview />
        <div className="my-8">
          <IconLeftTwoTextRight
            icon={Calendar}
            heading="Event Date"
            text={
              booking.date ? format(booking?.date, "EEEE, MMMM d, yyyy") : ""
            }
          />
          <IconLeftTwoTextRight
            icon={Clock}
            heading="Time"
            text={booking.time || ""}
          />

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
            <span className="block font-semibold"> {booking.description}</span>

            <span className="block text-sm text-secondary-font-color">
              {`${booking.serviceDuration || ""} mins`}
            </span>
          </div>
          <span className="font-semibold">{booking.price || ""}</span>
        </section>
      </div>
      <div className="mt-6 flex flex-col justify-center rounded-lg border-1 border-light-accent bg-white px-2 py-8">
        <h4 className="mb-2 ml-4 text-lg font-bold">
          Special Instructions (Optional)
        </h4>
        <textarea
          className="mx-auto w-[96%] resize-none rounded-lg border-1 border-light-accent p-2"
          placeholder="Any specific requests or instructions for the provider (e.g. 'Don't ring the doorbell', 'gate code is 1234',etc.)"
          rows={4}
          value={booking.serviceNotes || ""}
          onChange={(e) => updateBooking({ serviceNotes: e.target.value })}
        />
      </div>
    </section>
  );
}
