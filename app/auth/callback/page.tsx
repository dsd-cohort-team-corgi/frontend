"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabase";

// needs to be a page.tsx not a route.ts because supabaseClient.auth.getSession() is using client side logic
// otherwise they'll be an error because route.ts is just for api handlers

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  const [messageToUser, setMessageToUser] = useState(
    "Finishing signing you in ...",
  );
  const router = useRouter();

  useEffect(() => {
    // Supabase will handle restoring the session from the URL
    let redirectPath = localStorage.getItem("redirectPath") || "/";

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      // normally when you're subscribing to authChange events we'd want to specify what events we'd redirect on
      //  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session)
      // HOWEVER, this subscription does not apply globally, once we navigate away from app\auth\callback it will be gone
      // we're only accessing this page after the google sign in has succeeded

      // so it has been simplified
      // whether successful or not, we'll want to send the user back to the original page
      // but we'll pass a message to them if setting the session did fail

      if (!session) {
        setMessageToUser(
          "There was an error when signing you in! No session was found. Returning to previous page ",
        );
      }

      if (!redirectPath) {
        // Wait and retry once before defaulting to "/"
        setTimeout(() => {
          redirectPath = localStorage.getItem("redirectPath") || "/";
          localStorage.removeItem("redirectPath");
          router.replace(redirectPath);
        }, 50);
      } else {
        localStorage.removeItem("redirectPath");
        router.replace(redirectPath);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // on page load, Supabase will automatically look at the URL hash and automagically set a session in cookies
  // .getSession() wasn't working because of a timing issue, so onAuthStateChange was used instead
  // Supabase stores session data (especially the JWT and user identity info) in a cookie. Sometimes, this data gets too big for a single cookie (max ~4KB), so Supabase will split it into two parts:
  //    part 1 of the token (typically the access token) sb-<project-ref>-auth-token.
  //    part 2 (often identity data, maybe even the refresh token).
  // They work together as one session.

  return <p>{messageToUser} </p>;
}

// even though we're subscribed to auth changes in the header (aka if the session changes) we still need this because:
// It’s the return URI Supabase redirects to after Google signs in the user
// The Supabase client-side session/auth-change listener in the layout only sees the session after that cookie is set
