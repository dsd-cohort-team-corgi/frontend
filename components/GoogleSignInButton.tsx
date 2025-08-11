"use client";

import { useBooking } from "./context-wrappers/BookingContext";
import useGoogleLogin from "@/lib/hooks/useGoogleLogin";
import StyledAsButton from "./StyledAsButton";

export default function GoogleSignInButton() {
  const { booking } = useBooking();

  return <StyledAsButton onPress={useGoogleLogin(booking)} label="Sign In" />;
}
