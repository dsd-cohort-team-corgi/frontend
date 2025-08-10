"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    if (booking && booking.redirectPath) {
      // Save booking details in cookies for use after login
      // if statement because booking is not needed for the navbar login
      setBookingCookies(booking, cookieExpirationInDays);
      setCookie(
        "redirectPath",
        booking.redirectPath,
        // ex: /checkout, /provider/category/providerid
        cookieExpirationInDays,
        "/",
      );
    } else {
      setCookie(
        "redirectPath",
        window.location.pathname,
        // ex: when clicking on the navbar login, this is wherever they were at
        cookieExpirationInDays,
        "/",
      );
    }
  }, [booking]);

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

    // placed in useEffect because Supabase relies on window.location under the hood
    // and google oAuth also relies on window.google
    // We use useEffect to ensure rendering has happened on the client side,
    // so the window object is available, avoiding hydration errors

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
    // auth.signInWithOAuth logs out on server

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

    // When a user clicks on the login to google button:
    // 1. Supabase redirects the browser to Google's oauth endpoint
    // 2. Google shows the login screen
    // 3. if the user accepts, Google redirects the user back to Supabase, not our app, with a temporary OAuth code in the URL
    //    URL: https://your-project.supabase.co/auth/v1/callback?code=xyz

    // Once Google authenticates the user, Supabase:
    // 1. Exchanges the oAuth authorization code for tokens (access token, ID token / JWT). This is handled behind the scenes by supabase
    //    - access_token (Google)
    //    - id_token (JWT with user info)
    // 2. generates a supabase session (with its own access and refresh tokens)
    // 3. redirects the user to your redirectTo URL (/auth/callback) with session data in the URL fragment (#access_token=...).
    // 4. auth callback is needed because we need to catch the token from that url and persist the session on the client
    // otherwise the user won't be signed in to the app

    // 5. In  /auth/callback we do:
    //    const {  data: { subscription },} = supabaseClient.auth.onAuthStateChange((event, session) =>
    //    to read the access token (JWT) from the end of the url and store it in local storage (automatically)
    // 6. They are now logged in! JWT is then used for all future Supabase requests, like: supabase.from("users").select("*"); // Automatically sends JWT in headers

    if (result.error) console.error("Login failed:", result.error);
    // supabase handles the session, and stores it in localStorage.
  };

  return <StyledAsButton onPress={handleLoginWithSupabase} label="Sign In" />;
}
