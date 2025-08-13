export default function combineDateAndTimeToISOString(
  date: Date,
  timeStr: string,
): string {
  const [time, AmOrPm] = timeStr.split(" ");
  const [rawHours, rawMinutes] = time.split(":").map(Number);

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (AmOrPm === "PM" && hours < 12) hours += 12;
  if (AmOrPm === "AM" && hours === 12) hours = 0;

  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);

  return combined.toISOString();
}
