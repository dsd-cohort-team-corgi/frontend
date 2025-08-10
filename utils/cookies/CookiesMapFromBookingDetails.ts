type BookingKey = keyof BookingDetailsType;

export type CookieMapping<K extends BookingKey = BookingKey> = {
  key: K;
  cookieName: string;
};

// Helper to convert camelCase keys → snake_case with "booking_" prefix
const toCookieName = (key: string) =>
  `booking_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`;

// Auto-generate mapping from BookingDetailsType
export const cookieMappings: CookieMapping[] = (
  Object.keys({} as BookingDetailsType) as BookingKey[]
).map((key) => ({
  key,
  cookieName: toCookieName(key),
}));
