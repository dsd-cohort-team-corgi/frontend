export default function calculateBusyTimes(
  appointments: Appointment[],
  interval = 30,
): Set<string> {
  // we're going to get iso date strings "2025-07-23T10:30:00Z", and an appointmentLength number from the server
  const busySet = new Set<string>();

  appointments.forEach(({ start_time, duration }) => {
    const startDate = new Date(start_time);

    // convert the string "2025-07-23T10:30:00Z"  to a date object
    const slotsNeeded = duration / interval;
    // how many 30 minutes slots are needed for this appointment?
    // 90 minutes / 30 mins for each slot = 3 slots

    for (let i = 0; i < slotsNeeded; i += 1) {
      const slot = new Date(startDate);
      // we make a copy of the date (startDate) because if we directly referenced startDate, each loop would be overwritting the orginal start date object
      // so each loop after the 1st one would be off
      slot.setMinutes(slot.getMinutes() + i * interval);
      // loop 0: Original Date time + 0 * 30   result: 2025-07-23T10:30:00.000Z
      // loop 1: Original Date Time + 1 * 30   result: 2025-07-23T11:00:00.000Z
      // loop 2: Original Date Time + 2 * 30   result: 2025-07-23T11:30:00.000Z
      const label = slot.toLocaleString([], {
        // year: "numeric",
        // month: "2-digit",
        // day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        // use military time
      });
      // "10:30"
      //  "11:00",
      // "11:30"
      busySet.add(label);
    }
  });

  return busySet;
}
