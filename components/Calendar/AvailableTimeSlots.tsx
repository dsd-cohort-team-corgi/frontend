import React from "react";
import StyledAsButton from "../StyledAsButton";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import returnAvailableTimeSlotsIn12Hour from "@/utils/returnAvailableTimeSlotsIn12Hour";

type AvailableTimeSlotsType = {
  serviceLength: number;
  providersAppointments: Appointment[];
};
export default function AvailableTimeSlots({
  serviceLength,
  providersAppointments,
}: AvailableTimeSlotsType) {
  const { booking, updateBooking } = useBooking();

  const availableTimeSlots = returnAvailableTimeSlotsIn12Hour({
    serviceLength,
    providersAppointments,
  });

  function handleSlotChangeWithContext(slot: string) {
    if (booking.time === slot) {
      updateBooking({ time: "" });
    } else {
      updateBooking({ time: slot });
    }
  }
  return (
    <div className="w-full">
      <ul className="flex w-full flex-col gap-y-3">
        {availableTimeSlots.map((slot) => (
          <li
            className="group w-full rounded-md border-1 border-light-accent text-center hover:bg-primary"
            key={`li available time ${slot}`}
          >
            <StyledAsButton
              key={slot}
              label={slot}
              className="text-md w-full bg-transparent font-semibold text-black group-hover:text-white"
              // w-full that way if you click anywhere on the li, the special click ripple animation will be shown, since the button "fills" the li
              onPress={() => {
                handleSlotChangeWithContext(slot);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
