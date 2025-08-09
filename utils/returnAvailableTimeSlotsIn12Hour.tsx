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

  const allTimeSlots = generateTimeSlots(9, 17, 30);

  const availableStartTimes = getValidAppointmentStartTimes({
    allTimeSlots,
    busySlots, // [   ("10:30", "11:00", "13:00", "14:00") ];
    serviceLength, // 60 === needs 2 consecutive open slots
  });

  const availableTimesIn12HourFormat =
    convertTimeFrom24To12Hours(availableStartTimes);

  return availableTimesIn12HourFormat;
}
