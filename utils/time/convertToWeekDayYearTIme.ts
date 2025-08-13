import { format } from "date-fns";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function convertToWeekDayYearTime(isoString: string) {
  const date = new Date(isoString);

  const inLowerCase = format(date, "EEEE do, yyyy 'at' h:mma").toLowerCase();

  // lowercase is needed, otherwise you get
  // Fri Aug 15 2025 00:00:00 GMT-0700 (Pacific Daylight Time)2:30 PM
  const formattted = capitalizeFirstLetter(inLowerCase);
  return formattted;
  // "friday 15th, 2025 at 4:00pm"
}
