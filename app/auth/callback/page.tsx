"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

import { getCookie, removeCookie } from "@/utils/cookies/cookies";

// needs to be a page.tsx not a route.ts because supabaseClient.auth.getSession() is using client side logic
// otherwise they'll be an error because route.ts is just for api handlers

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  const [messageToUser, setMessageToUser] = useState(
    "Finishing signing you in ...",
  );

  const [pollingEnabled, setPollingEnabled] = useState(true);
  // tanstack query's logic relies on the component's render cycle to toggle polling on/off so useRef wouldn't work right
  const redirectPathRef = useRef<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Read cookie once immediately on mount
    redirectPathRef.current = getCookie("redirectPath") || "/";
  }, []);

  const handleRedirect = () => {
    // by the time handleRedirect runs, the cookie has had time to be placed in the handleRedirect state (avoids race conditions)
    // when removeCookie() was placed in the getCookie use effect, it kept deleting the cookie before it was finished being read, so we kept getting redirected to "/"
    removeCookie("redirectPath");

    if (redirectPathRef.current !== null) {
      router.replace(redirectPathRef.current);
    }
  };

  const hasHashTokens = () => {
    if (typeof window === "undefined") return false;
    const hash = window.location.hash;
    return hash.includes("access_token") || hash.includes("error");
  };

  // React Query poller to check session every 800ms max 5 tries (~4s)

  const {
    data: session,
    isFetching,
    failureCount,
  } = useQuery({
    queryKey: ["authSession"],
    queryFn: () =>
      supabaseClient.auth.getSession().then((res) => res.data.session),
    refetchInterval: pollingEnabled ? 800 : false,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: pollingEnabled,
  });
  useEffect(() => {
    // Fail fast if no tokens in URL
    if (!hasHashTokens()) {
      setMessageToUser(
        "Signin failed. No valid access_token or error exists for Supabase to process the login. Redirecting...",
      );
      setTimeout(handleRedirect, 1500);
      return;
    }

    // Subscribe to auth state changes for edge cases
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        setMessageToUser("Signed in! Redirecting...");
        setPollingEnabled(false); // <-- STOP react-query polling, no need to keep checking
        handleRedirect();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    // When polling yields a session, redirect
    if (session) {
      setMessageToUser("Signed in! Redirecting...");
      setPollingEnabled(false); // <-- STOP polling here too if we got session from polling
      handleRedirect();
    } else if (!isFetching && failureCount >= 5) {
      // After 5 failed polls (~4s), show error and redirect
      setMessageToUser(
        "Signin failed, recheck your url. No session found. Redirecting...",
      );
      setTimeout(handleRedirect, 1500);
    }
  }, [session, isFetching, failureCount]);

  // on page load, Supabase will automatically look at the URL hash and automagically set a session in cookies
  // Supabase stores session data (especially the JWT and user identity info) in a cookie. Sometimes, this data gets too big for a single cookie (max ~4KB), so Supabase will split it into two parts:
  //    part 1 of the token (typically the access token) sb-<project-ref>-auth-token.
  //    part 2 (often identity data, maybe even the refresh token).
  // They work together as one session.

  return <p>{messageToUser} </p>;
}

// even though we're subscribed to auth changes in the header (aka if the session changes) we still need this because:
// It’s the return URI Supabase redirects to after Google signs in the user
// The Supabase client-side session/auth-change listener in the layout only sees the session after that cookie is set
