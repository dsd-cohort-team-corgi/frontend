import { removeCookie, getCookie, setCookie } from "./cookies";
import { cookieMappings } from "@/utils/cookies/CookiesMapFromBookingDetails";

export function deleteBookingCookies() {
  cookieMappings.forEach(({ cookieName }) => {
    removeCookie(cookieName);
  });
}

export function getBookingFromCookies(): Partial<BookingDetailsType> {
  const booking: Partial<BookingDetailsType> = {};

  cookieMappings.forEach(({ key, cookieName }) => {
    const value = getCookie(cookieName);
    if (value !== undefined) {
      switch (key) {
        case "price":
          booking.price = Number.isNaN(Number(value)) ? value : Number(value);
          break;
        case "serviceDuration":
          booking.serviceDuration = Number(value);
          break;
        case "date": {
          // Try to parse date string from cookie, fallback to undefined
          const parsedDate = new Date(value);
          booking.date = Number.isNaN(parsedDate.getTime())
            ? undefined
            : parsedDate;
          break;
        }
        case "providerId":
        case "serviceId":
          booking[key] = value;
          break;
        case "time":
        case "description":
          booking[key] = value;
          break;
        default:
          // For safety, assign string value for other keys (shouldn't hit here)
          booking[key] = value;
          break;
      }
    }
  });

  return booking;
}

export function setBookingCookies(booking: BookingDetailsType, days = 1) {
  // we don't want to use every property in booking, since the booking object will be updated with company name, firstname, lastname on page load
  // although providerId will also be set up on page load, we need it immediately for the logic to decide whether to use the cookies later, so we'll include it here

  cookieMappings.forEach(({ key, cookieName }) => {
    const value = booking[key];
    if (value !== undefined && value !== null) {
      const strValue = String(value);
      setCookie(cookieName, strValue, days);
      console.log(`Cookie set: ${cookieName}`, getCookie(cookieName));
    }
  });
}
