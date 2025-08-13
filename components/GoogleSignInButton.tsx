"use client";

import React from "react";
import supabaseClient from "@/lib/supabase";
import StyledAsButton from "./StyledAsButton";
import { setBookingCookies } from "@/utils/cookies/bookingCookies";
import { setCookie } from "@/utils/cookies/cookies";
import { useBooking } from "./context-wrappers/BookingContext";

export default function GoogleSignInButton() {
  // Save the current path before loging so they get sent back to the right page

  const { booking } = useBooking();
  console.log("google sign in", booking);
  const cookieExpirationInDays = 0.0034722;
  // ~ 5 minutes

  const handleLoginWithSupabase = async () => {
    console.log("=== DEBUG INFO ===");
    console.log("Button clicked!");
    console.log("NEXT_PUBLIC_URL:", process.env.NEXT_PUBLIC_URL);
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
    console.log("Supabase client:", supabaseClient);
    console.log("Window location:", window.location.href);
    console.log("==================");

    if (booking && booking.redirectPath) {
      setBookingCookies(booking, cookieExpirationInDays);
    } else {
      setCookie(
        "booking_redirect_path",
        window.location.pathname,
        cookieExpirationInDays,
        "/",
      );
    }

    // placed in useEffect to avoid hydration errors because Supabase & google oAuth relies on window.location under the hood

    if (typeof window === "undefined") return;

    try {
      // Add timeout to prevent hanging
      const signOutPromise = supabaseClient.auth.signOut({ scope: "global" });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Sign out timeout after 5 seconds")),
          5000,
        );
      });

      const signOutResult = await Promise.race([
        signOutPromise,
        timeoutPromise,
      ]);
      console.log("Sign out result:", signOutResult);
      console.log("Sign out complete, about to start OAuth...");
    } catch (error) {
      console.error("Sign out error:", error);
      console.log("Continuing with OAuth despite sign out error...");
    }

    console.log("Starting OAuth...");

    const result = await supabaseClient.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    console.log("OAuth result:", result);
    if (result.error) console.error("Login failed:", result.error);

    if (result.error) console.error("Login failed:", result.error);
  };

  return <StyledAsButton onPress={handleLoginWithSupabase} label="Sign In" />;
}
