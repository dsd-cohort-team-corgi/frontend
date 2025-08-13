export default function calculateBusyTimes(
  appointments: Appointment[],
  interval = 30,
): Set<string> {
  const busySet = new Set<string>();

  appointments.forEach(({ start_time, duration }) => {
    const startDate = new Date(start_time);
    const slotsNeeded = duration / interval;

    for (let i = 0; i < slotsNeeded; i += 1) {
      const slot = new Date(startDate);
      // we make a copy of the date (startDate) because if we directly referenced startDate, each loop would be overwritting the orginal start date object

      slot.setMinutes(slot.getMinutes() + i * interval);

      const label = slot.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        // use military time
      });

      busySet.add(label);
    }
  });

  return busySet;
}
