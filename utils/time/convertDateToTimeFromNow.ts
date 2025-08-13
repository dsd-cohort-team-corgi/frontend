import { formatDistanceToNow } from "date-fns";

export default function convertDateToTimeFromNow(date: string) {
  const timeInHumanWords = formatDistanceToNow(date, {
    addSuffix: true,
  });
  // addSuffix: Add "X ago"/"in X" in the locale language

  return timeInHumanWords;
}
