import generateTimeSlots from "@/utils/time/timeslots/generateTimeSlots";
import convertTimeFrom24To12Hours from "@/utils/time/convertTimeFrom24To12Hours";
import calculateBusyTimeSlots from "@/utils/time/timeslots/calculateBusyTimeSlots";
import getValidAppointmentStartTimes from "@/utils/time/timeslots/getValidAppointmentStartTimes";

type AvailableTimeSlotsType = {
  serviceLength: number;
  providersAppointments: Appointment[];
};

export default function returnAvailableTimeSlotsIn12Hour({
  serviceLength,
  providersAppointments,
}: AvailableTimeSlotsType) {
  const busySlots = calculateBusyTimeSlots(providersAppointments);

  const allTimeSlots = generateTimeSlots(8, 23, 30);

  const availableStartTimes = getValidAppointmentStartTimes({
    allTimeSlots,
    busySlots,
    serviceLength,
  });

  const availableTimesIn12HourFormat =
    convertTimeFrom24To12Hours(availableStartTimes);

  return availableTimesIn12HourFormat;
}
