export default function filterPhoneInput(input: string): string {
  // Allow only digits (0-9) and hyphens (-)
  const filtered = input
    .split("")
    .filter((char) => /[0-9-]/.test(char))
    .join("");
  return filtered;
}
