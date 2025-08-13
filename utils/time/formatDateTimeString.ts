export default function formatDateTimeString(dateTimeString: string): {
  datePart: string;
  timePart: string;
} {
  const standardizedString = dateTimeString
    .replace(" ", "T")
    .replace("+00", "Z");

  const date = new Date(standardizedString);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string provided.");
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const datePart = new Intl.DateTimeFormat(undefined, options).format(date);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const timePart = new Intl.DateTimeFormat(undefined, timeOptions).format(date);

  return { datePart, timePart };
}
