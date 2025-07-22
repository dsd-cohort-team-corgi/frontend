import React, { Dispatch, SetStateAction } from "react";
import calculateBusyTimeSlots from "@/utils/calculateBusyTimeSlots";
import getValidAppointmentStartTimes from "@/utils/getValidAppointmentStartTimes";
import StyledAsButton from "../StyledAsButton";
import handleClickToggleOffOrChangeState from "@/utils/handleClickToggleOffOrChangeState";
import generateTimeSlots from "@/utils/generateTimeSlots";

type AvailableTimeSlotsType = {
  serviceLength: number;
  setSelectedTimeSlot: Dispatch<SetStateAction<string | undefined>>;
  providersAppointments: Appointment[];
};
export default function AvailableTimeSlots({
  serviceLength,
  setSelectedTimeSlot,
  providersAppointments,
}: AvailableTimeSlotsType) {
  const busySlots = calculateBusyTimeSlots(providersAppointments);

  const allTimeSlots = generateTimeSlots(9, 17, 30);

  const availableStartTimes = getValidAppointmentStartTimes({
    allTimeSlots,
    busySlots, // [   ("10:30", "11:00", "13:00", "14:00") ];
    serviceLength, // 60 === needs 2 consecutive open slots
  });
  return (
    <div className="w-full">
      <ul className="flex w-full flex-col gap-y-3">
        {availableStartTimes.map((slot) => (
          <li
            className="group w-full rounded-md border-1 border-light-accent text-center hover:bg-primary"
            key={`li available time ${slot}`}
          >
            <StyledAsButton
              key={slot}
              label={slot}
              className="text-md w-full bg-transparent font-semibold text-black group-hover:text-white"
              // w-full that way if you click anywhere on the li, the special click ripple animation will be shown, since the button "fills" the li
              onPress={() =>
                handleClickToggleOffOrChangeState({
                  newId: slot,
                  setState: setSelectedTimeSlot,
                })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
