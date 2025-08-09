export default function convertDateObjToDate(dateObj: Date) {
  const date = dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return date;
}
