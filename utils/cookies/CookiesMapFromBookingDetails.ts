type BookingKey = keyof BookingDetailsType;

export type CookieMapping<K extends BookingKey = BookingKey> = {
  key: K;
  cookieName: string;
};
// Explicitly list all keys from BookingDetailsType here, so the keys are available at runtime
const bookingKeys = [
  "paymentIntentId",
  "serviceId",
  "customerId",
  "providerId",
  "addressId",
  "serviceTitle",
  "companyName",
  "firstName",
  "lastName",
  "description",
  "price",
  "rating",
  "serviceDuration",
  "location",
  "time",
  "date",
  "availableTime",
  "serviceNotes",
  "redirectPath",
] as const;

// Helper to convert camelCase keys → snake_case with "booking_" prefix
const toCookieName = (key: string) =>
  `booking_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`;

export const cookieMappings: CookieMapping[] = bookingKeys.map((key) => ({
  key,
  cookieName: toCookieName(key),
}));
