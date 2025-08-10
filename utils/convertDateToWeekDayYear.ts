import { format } from "date-fns";

export default function convertDateToWeekDayYear(date: Date) {
  return format(date, "EEEE, MMMM d, yyyy");
}
