export default function convertTimeFrom24To12Hours(timeStrings: string[]) {
  // "13:00" ==> "1:00 PM"
  const convertedTimeArrayToAmPm = timeStrings.map((t) => {
    const [hour, minute] = t.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });

  return convertedTimeArrayToAmPm;
}
