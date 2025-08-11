"use client";

import { useBooking } from "./context-wrappers/BookingContext";
import useGoogleLogin from "@/lib/hooks/useGoogleLogin";
import StyledAsButton from "./StyledAsButton";

export default function GoogleSignInButton() {
  const { booking } = useBooking();
  const login = useGoogleLogin(booking);

  return <StyledAsButton onPress={login} label="Sign In" />;
}
