type AuthKey = keyof AuthDetailsType;

export type CookieMapping<K extends AuthKey = AuthKey> = {
  key: K;
  cookieName: string;
};
// Explicitly list all keys from BookingDetailsType here, so the keys are available at runtime
const AuthKeys = [
  "displayName",
  "phoneNumber",
  "email",
  "supabaseUserId",
  "avatarUrl",
  "customerId",
  "providerId",
  "firstName",
  "lastName",
  "streetAddress1",
  "streetAddress2",
  "city",
  "state",
  "zip",
  "addressId",
  "hasCompletedAuthCheck",
] as const;

const toCookieName = (key: string) =>
  `auth_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`;

export const cookieMappings: CookieMapping[] = AuthKeys.map((key) => ({
  key,
  cookieName: toCookieName(key),
}));
