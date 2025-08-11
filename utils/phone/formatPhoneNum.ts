export default function formatPhoneNumber(input: string) {
  // Strip all non-digit characters
  let digits = input.replace(/\D/g, "");

  // Limit to max 10 digits
  if (digits.length > 10) digits = digits.slice(0, 10);

  // Insert hyphens
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}
