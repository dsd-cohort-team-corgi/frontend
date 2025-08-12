"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import StarRatingReview from "../ProviderOverallRatingInfo";
import IconLeftTwoTextRight from "../IconLeftTwoTextRight";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import formatDateTimeString from "@/utils/formatDateTimeString";
import { getBookingFromCookies } from "@/utils/cookies/bookingCookies";
import DiscountForm from "./DiscountForm";
import { CouponObject } from "@/app/types/coupon";

type BookingCheckoutPageType = {
  couponCode: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
};

export default function BookingCheckoutPage({
  couponCode,
  setCouponCode,
}: BookingCheckoutPageType) {
  const { authContextObject } = useAuthContext();

  const { booking, updateBooking } = useBooking();
  const [couponObject, setCouponObject] = useState<CouponObject | null>(null);

  function calculateNewPrice(fullPrice: number | string, discount: number) {
    const fullPriceInteger = Number(fullPrice);
    const discountInDollars = fullPriceInteger * (discount / 100);
    return fullPriceInteger - discountInDollars;
  }

  const addressFromAuth = `${authContextObject.streetAddress1}
  ${authContextObject.streetAddress2}
  ${authContextObject.city}
    ${authContextObject.state}
     ${authContextObject.zip}`;

  const discount = couponObject != null ? couponObject.discount_value : 0;

  // wrapping updateBooking in a useEffect so it will only run once or when the autoContextObject changes, instead of on every render
  useEffect(() => {
    const bookingFromCookies = getBookingFromCookies(); // will return {} if its empty, so we won't have errors when spreading like we would with null data
    if (bookingFromCookies) {
      updateBooking({
        ...bookingFromCookies,
      });
    }

    updateBooking({
      customerId: authContextObject.customerId,
      addressId: authContextObject.addressId,
    });
  }, [authContextObject.customerId]);

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
            text={
              authContextObject.streetAddress1
                ? addressFromAuth
                : "456 1st St San Francisco CA 94534"
            }
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

          {couponObject && booking.price ? (
            <div className="font-semibold">
              <span className="font-semibold"> Total: </span>
              <span className="line-through"> {`$${booking.price}`}</span>
              <span className=" text-emerald-700">
                {" "}
                ${calculateNewPrice(booking.price || 0, discount)}
              </span>
            </div>
          ) : (
            <span className="font-semibold">{`Total: $${booking.price}`}</span>
          )}
        </section>
        <div className="flex justify-end w-full">
          <DiscountForm
            setCouponObject={setCouponObject}
            setCouponCode={setCouponCode}
            couponCode={couponCode}
          />
        </div>
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
