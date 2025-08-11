import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function formatPhoneNumber(input: string) {
  // Strip all non-digit characters
  const digits = input.replace(/\D/g, "").slice(0, 10); // US: max 10 digits

  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 6));
  if (digits.length > 6) parts.push(digits.slice(6));
  return parts.join("-");
}

export function getE164ForSupabase(input: string) {
  const parsed = parsePhoneNumberFromString(input, "US");
  return parsed?.isValid() ? parsed.number : null; // E.164 format if valid
}
