import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import StyledAsButton from "../StyledAsButton";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import returnAvailableTimeSlotsIn12Hour from "@/utils/time/timeslots/returnAvailableTimeSlotsIn12Hour";

type AvailableTimeSlotsType = {
  serviceLength: number;
  providersAppointments: Appointment[];
};
export default function AvailableTimeSlots({
  serviceLength,
  providersAppointments,
}: AvailableTimeSlotsType) {
  const { booking, updateBooking } = useBooking();
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 6;

  const availableTimeSlots = returnAvailableTimeSlotsIn12Hour({
    serviceLength,
    providersAppointments,
  });

  const handleUp = () => {
    setStartIndex((prev) => Math.max(prev - pageSize, 0));
  };

  const handleDown = () => {
    setStartIndex((prev) =>
      Math.min(prev + pageSize, availableTimeSlots.length - pageSize),
    );
  };

  const visibleSlots = availableTimeSlots.slice(
    startIndex,
    startIndex + pageSize,
  );

  function handleSlotChangeWithContext(slot: string) {
    if (booking.time === slot) {
      updateBooking({ time: "" });
    } else {
      updateBooking({ time: slot });
    }
  }
  return (
    <div className="w-full">
      <StyledAsButton
        type="button"
        onPress={handleUp}
        disabled={startIndex === 0}
        className=" w-full disabled:bg-slate-600 mb-4"
        startContent={<ArrowBigUp />}
      />
      <ul className="flex w-full flex-col gap-y-3">
        {visibleSlots.map((slot) => (
          <li
            className="group w-full rounded-md border-1 border-light-accent text-center hover:bg-primary"
            key={`li available time ${slot}`}
          >
            <StyledAsButton
              key={slot}
              label={slot}
              className="text-md w-full bg-transparent font-semibold text-black group-hover:text-white"
              onPress={() => {
                handleSlotChangeWithContext(slot);
              }}
            />
          </li>
        ))}
      </ul>
      <StyledAsButton
        onPress={handleDown}
        className="w-full  disabled:bg-slate-600 mt-4"
        disabled={startIndex + pageSize >= availableTimeSlots.length}
        startContent={<ArrowBigDown />}
      />
    </div>
  );
}
