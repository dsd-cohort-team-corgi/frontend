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
  busySlots: Set<string>;
  serviceLength: number;
  interval?: number;
}): string[] {
  const requiredSlots = serviceLength / interval;
  const result: string[] = [];

  for (let i = 0; i <= allTimeSlots.length - requiredSlots; i += 1) {
    const currentWindow = allTimeSlots.slice(i, i + requiredSlots);

    const isValid = currentWindow.every((slot, index) => {
      // is the time slot busy? if so return false
      if (busySlots.has(slot)) return false;

      if (
        index > 0 &&
        !isNextSlotSequential(currentWindow[index - 1], slot, interval)
      )
        return false;

      return true;
    });

    if (isValid) {
      result.push(allTimeSlots[i]);
    }
  }
  return result;
}
