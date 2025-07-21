import { formatDistanceToNow } from "date-fns";
// https://date-fns.org/v4.1.0/docs/formatDistanceToNow

export default function convertDateToTimeFromNow(date: string) {
  const timeInHumanWords = formatDistanceToNow(date, {
    addSuffix: true,
  });
  // addSuffix: Add "X ago"/"in X" in the locale language

  return timeInHumanWords;
}
