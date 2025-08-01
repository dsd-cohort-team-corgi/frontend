"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AvailableTimeSlots from "./AvailableTimeSlots";
import { useBooking } from "@/components/context-wrappers/BookingContext";

type CalendarType = {
  providersAppointments: Appointment[];
  serviceLength: number;
  selectedTimeSlot: string | undefined;
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function Calendar({
  providersAppointments,
  serviceLength,
  selectedTimeSlot,
  setSelectedTimeSlot,
}: CalendarType) {
  const { updateBooking } = useBooking();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();

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

  function updateSelectedDay(day?: Date) {
    if (day) {
      setSelectedDay(day);
      updateBooking({ date: day });
    }
  }

  return (
    <div className="max-w-md">
      <div className="flex">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={(day) => {
            updateSelectedDay(day);
          }}
          startMonth={today}
          endMonth={twoWeeksLater}
          disabled={[{ before: today }, { after: twoWeeksLater }]}
        />
        {selectedDay && (
          <AvailableTimeSlots
            serviceLength={serviceLength}
            setSelectedTimeSlot={setSelectedTimeSlot}
            providersAppointments={providersAppointments}
          />
        )}
      </div>
      <div className="mt-8">
        <span className="">
          {selectedDay instanceof Date
            ? format(selectedDay, "EEEE, MMMM d, yyyy")
            : "Select a day and time"}
        </span>
        {selectedDay && (
          <span> {`at ${selectedTimeSlot || "select a time"}`}</span>
        )}
      </div>
    </div>
  );
}
