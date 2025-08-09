// Helper: Check if timeB is exactly interval mins after timeA
function isNextSlotSequential(
  timeA: string,
  timeB: string,
  interval: number,
): boolean {
  const [hoursA, minutesA] = timeA.split(":").map(Number);
  const [hoursB, minutesB] = timeB.split(":").map(Number);
  const a = hoursA * 60 + minutesA; // 2 * 60 + 30 = 150 minutes
  const b = hoursB * 60 + minutesB; // 3 * 60 + 00 = 180
  return b - a === interval; // 180- 150 = 30 minutes
}
// You use a sliding window of size serviceLength / 30 (number of 30-min slots needed), and:

//     Skip if any slot in the window is busy

//     Skip if the slots are not sequential (gap in time)

export default function getValidAppointmentStartTimes({
  allTimeSlots,
  busySlots,
  serviceLength,
  interval = 30,
}: {
  allTimeSlots: string[];
  //  [ "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00" ]
  busySlots: Set<string>;
  // [  "10:30", "11:00", "13:00", "14:00" ];
  serviceLength: number;
  interval?: number;
}): string[] {
  const requiredSlots = serviceLength / interval;
  const result: string[] = [];

  for (let i = 0; i <= allTimeSlots.length - requiredSlots; i += 1) {
    const currentWindow = allTimeSlots.slice(i, i + requiredSlots);
    // ex: required slots = 3, then we'd be slicing the allTimeSlots into 3 items at a time, and checking if the slots are available and sequential

    const isValid = currentWindow.every((slot, index) => {
      // is the time slot busy? if so return false
      if (busySlots.has(slot)) return false;

      // is the next slot sequential? if not, return false
      // we skip index 0, since its a starting point, we don't have to check if its sequential to the void ;)
      if (
        index > 0 &&
        !isNextSlotSequential(currentWindow[index - 1], slot, interval)
      )
        return false;
      // otherwise we DO have enough timeslots avaible to fulfill the service duration (ex: 3 sequential 30 minute slots for 90 minutes)
      // so return true
      return true;
    });

    if (isValid) {
      result.push(allTimeSlots[i]);
    }
  }
  return result;
}
