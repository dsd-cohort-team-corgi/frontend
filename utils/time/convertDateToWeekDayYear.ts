import { format } from "date-fns";

export default function convertDateToWeekDayYear(date: Date | undefined) {
  if (!date) {
    return;
  }
  return format(date, "EEEE, MMMM d, yyyy");
}
