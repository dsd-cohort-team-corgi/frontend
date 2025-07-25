export default function generateTimeSlots(
  startHour = 9,
  endHour = 17,
  intervalMinutes = 30,
): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      // pad start ensures each hour and m fit are 2 characters long
      // 5 ==> "05"   30 ==> 30
      slots.push(`${h}:${m}`);
    }
  }

  return slots;
}
