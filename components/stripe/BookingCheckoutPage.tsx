"use client";

import React, { useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import StarRatingReview from "../ProviderOverallRatingInfo";
import IconLeftTwoTextRight from "../IconLeftTwoTextRight";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import formatDateTimeString from "@/utils/formatDateTimeString";

export default function BookingCheckoutPage() {
  const { authContextObject } = useAuthContext();

  const { booking, updateBooking } = useBooking();

  const addressFromAuth = `${authContextObject.streetAddress1}
  ${authContextObject.streetAddress2}
  ${authContextObject.city}
    ${authContextObject.state}
     ${authContextObject.zip}`;
  console.log(booking);

  // wrapping updateBooking in a useEffect so it will only run once or when the autoContextObject changes, instead of on every render
  useEffect(
    () =>
      updateBooking({
        customerId: authContextObject.customerId,
        addressId: authContextObject.addressId,
      }),
    [authContextObject.customerId],
  );

  let eventDate = "";
  let eventTime = "";

  if (booking.date) {
    eventDate = format(booking.date, "EEEE, MMMM d, yyyy");
  } else if (booking.availableTime) {
    const { datePart, timePart } = formatDateTimeString(booking.availableTime);
    eventDate = datePart;
    eventTime = timePart;
  }

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
            text={eventDate}
          />
          <IconLeftTwoTextRight
            icon={Clock}
            heading="Time"
            text={booking.time || (booking.availableTime ? eventTime : "")}
            // since booking.available_time can be undefined, we need to do a guard check first
          />

          <IconLeftTwoTextRight
            icon={MapPin}
            heading="Location"
            text={addressFromAuth}
          />
        </div>
        <div className="flex items-center">
          <div className="mx-4 h-[2px] grow bg-light-accent" />
        </div>

        <section className="mt-5 flex justify-between">
          <div>
            <span className="block font-semibold"> {booking.serviceTitle}</span>

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
