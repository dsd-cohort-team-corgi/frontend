import { format } from "date-fns";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function convertToWeekDayYearTime(isoString: string) {
  const date = new Date(isoString);

  // 'do' → ordinal day (1st, 2nd, 3rd, 4th…)
  // 'EEEE' → full weekday
  // 'yyyy' → 4-digit year
  // 'h:mma' → 12-hour time with AM/PM
  const inLowerCase = format(date, "EEEE do, yyyy 'at' h:mma").toLowerCase();

  // lowercase is needed, otherwise you get
  // Fri Aug 15 2025 00:00:00 GMT-0700 (Pacific Daylight Time)2:30 PM
  const formattted = capitalizeFirstLetter(inLowerCase);
  return formattted;
  // "friday 15th, 2025 at 4:00pm"
}
