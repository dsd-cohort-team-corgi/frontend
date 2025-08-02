"use client";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AvailableTimeSlots from "./AvailableTimeSlots";
import { useBooking } from "@/components/context-wrappers/BookingContext";

type CalendarType = {
  providersAppointments: Appointment[];
  serviceLength: number;
};

export default function Calendar({
  providersAppointments,
  serviceLength,
}: CalendarType) {
  const { booking, updateBooking } = useBooking();
  // if all slots for the day are gone, add it as an unavailable day

  // when SelectedDay is not undefined (when user selects a day)
  // load selected time slots component

  // all slots from X am to X pm
  // calculate what 30 minute slots are unavailable

  // filter out slots that

  // let user click one to select a time

  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col sm:flex-row">
        <DayPicker
          mode="single"
          selected={booking.date}
          onSelect={(day) => updateBooking({ date: day, time: undefined })}
          startMonth={today}
          endMonth={twoWeeksLater}
          disabled={[
            { before: today },
            { after: twoWeeksLater },
            !booking.serviceId && true,
          ]}
        />
        {booking.date && (
          <AvailableTimeSlots
            serviceLength={serviceLength}
            providersAppointments={providersAppointments}
          />
        )}
      </div>
      <div className="mt-8">
        <span className="">
          {booking.date instanceof Date
            ? format(booking.date, "EEEE, MMMM d, yyyy")
            : "Select a day and time"}
        </span>
        {booking.date && (
          <span> {`at ${booking.time || "select a time"}`}</span>
        )}
      </div>
    </div>
  );
}
