"use client";

import { BookingProvider } from "@/components/context-wrappers/BookingContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookingProvider>{children}</BookingProvider>;
}
