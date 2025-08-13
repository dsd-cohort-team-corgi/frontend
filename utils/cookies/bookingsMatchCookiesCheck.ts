export default function bookingsMatch(
  bookingFromCookies: Partial<BookingDetailsType>,
  booking: Partial<BookingDetailsType>,
): boolean {
  return (
    Object.entries(bookingFromCookies) as [
      keyof BookingDetailsType,
      BookingDetailsType[keyof BookingDetailsType],
    ][]
  ).every(([key, cookieValue]) => {
    const bookingValue = booking[key];

    if (cookieValue instanceof Date && bookingValue instanceof Date) {
      return cookieValue.getTime() === bookingValue.getTime();
    }

    if (typeof cookieValue === "number" && typeof bookingValue === "string") {
      return Number(bookingValue) === cookieValue;
    }
    if (typeof cookieValue === "string" && typeof bookingValue === "number") {
      return Number(cookieValue) === bookingValue;
    }
    return bookingValue === cookieValue;
  });
}
