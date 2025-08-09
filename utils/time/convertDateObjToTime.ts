export default function convertDateObjToTime(dateObj: Date) {
  const time = dateObj.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return time;
}
