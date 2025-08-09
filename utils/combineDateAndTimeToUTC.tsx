export default function combineDateAndTimeToISOString(
  date: Date,
  timeStr: string,
): string {
  // 1. hours and minutes from "2:30 PM"
  const [time, AmOrPm] = timeStr.split(" ");
  const [rawHours, rawMinutes] = time.split(":").map(Number);
  // needed since typescript will complain if we use let instead of const, since rawMinutes won't be changing. But hours needs to be able to change
  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (AmOrPm === "PM" && hours < 12) hours += 12;
  if (AmOrPm === "AM" && hours === 12) hours = 0;

  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);

  return combined.toISOString();
}
