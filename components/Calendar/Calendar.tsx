"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AvailableTimeSlots from "./AvailableTimeSlots";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import convertDateToWeekDayYear from "@/utils/convertDateToWeekDayYear";

type CalendarType = {
  providersAppointments: Appointment[];
  serviceLength: number;
};

export default function Calendar({
  providersAppointments,
  serviceLength,
}: CalendarType) {
  const { booking, updateBooking } = useBooking();

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
            ? convertDateToWeekDayYear(booking.date)
            : "Select a day and time"}
        </span>
        {booking.date && (
          <span> {`at ${booking.time || "select a time"}`}</span>
        )}
      </div>
    </div>
  );
}
