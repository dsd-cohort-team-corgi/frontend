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
  // useCallback is used so these won't always be recreated, otherwise our useMemo will break
  // useCallback(fn, deps) returns a memoized version of a function — meaning React won't recreate the function unless the dependencies change, which it won't since we just did ann empty dependency array []

  // why useCallback?
  // so React components that consume the context don’t re-render unless the actual BOOKING value changes

  // Let’s say you're not using useCallback. Then on every render, updateBooking and resetBooking are brand new functions. Even if booking hasn't changed, the useMemo sees the object { booking, updateBooking, resetBooking } as new, because its function values are new.
  // So useMemo ends up pointlessly recomputing, and your context consumers may re-render anyway.

  // Analogy:
  //  useMemo is like saying: “Only bake a new cake if one of the ingredients changed.”
  // But if you toss in a freshly scrambled egg every time (i.e., a new function), it bakes a new cake anyway.
  // useCallback keeps that egg the same egg unless you say otherwise

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

// why useMemo? To avoid potential rerenders / help performance
// React will re-render every consumer of the context whenever the value prop changes — even if the change is just a new object reference and the values are technically the same!
// this could trigger rerenders:
//  <Context.Provider
//     value={{ currentUsersInfo, setTriggerRecheck, triggerRecheck }}
// Eslint error: The object passed as the value prop to the Context provider (at line 39) changes every render. To fix this consider wrapping it in a useMemo hook.
//
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
