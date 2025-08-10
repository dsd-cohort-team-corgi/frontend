import { format } from "date-fns";

export default function convertToWeekDayYearTime(isoString: string) {
  const date = new Date(isoString);

  // 'do' → ordinal day (1st, 2nd, 3rd, 4th…)
  // 'EEEE' → full weekday
  // 'yyyy' → 4-digit year
  // 'h:mma' → 12-hour time with AM/PM
  const formatted = format(date, "EEEE do, yyyy 'at' h:mma");

  return formatted;
  // "friday 15th, 2025 at 4:00pm"
}
