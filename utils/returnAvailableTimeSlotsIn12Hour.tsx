import generateTimeSlots from "@/utils/generateTimeSlots";
import convertTimeFrom24To12Hours from "@/utils/convertTimeFrom24To12Hours";
import calculateBusyTimeSlots from "@/utils/calculateBusyTimeSlots";
import getValidAppointmentStartTimes from "@/utils/getValidAppointmentStartTimes";

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
