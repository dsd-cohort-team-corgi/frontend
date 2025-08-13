"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AvailableTimeSlots from "./AvailableTimeSlots";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import convertDateToWeekDayYear from "@/utils/time/convertDateToWeekDayYear";

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
      <div className="flex flex-col sm:flex-row gap-4">
        {/* allow horizontal scroll on very small screens so DatePicker never overflows */}
        <div className="flex-shrink-0 w-full sm:w-auto overflow-x-auto touch-pan-x">
          <DayPicker
            className="w-full max-w-full rdp-mobile"
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
        </div>

        {/* make the time slot column responsive: full width on mobile, fixed-ish on sm+ */}
        {booking.date && (
          <div className="w-full sm:w-64">
            <AvailableTimeSlots
              serviceLength={serviceLength}
              providersAppointments={providersAppointments}
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        <span>
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
