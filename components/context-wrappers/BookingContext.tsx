"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

interface BookingContextType {
  booking: BookingDetailsType;
  updateBooking: (updates: Partial<BookingDetailsType>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingDetailsType>({});

  const updateBooking = useCallback((updates: Partial<BookingDetailsType>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking({});
  }, []);
  const memoizedBookingValue = useMemo(
    () => ({
      booking,
      updateBooking,
      resetBooking,
    }),
    [booking],
  );

  return (
    <BookingContext.Provider value={memoizedBookingValue}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
