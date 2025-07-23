"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabase";

// needs to be a page.tsx not a route.ts because supabaseClient.auth.getSession() is using client side logic
// otherwise they'll be an error because route.ts is just for api handlers

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // ✅ Supabase will handle restoring the session from the URL
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      // normally when you're subscribing to authChange events we'd want to specify what events we'd redirect on
      //  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session)
      // HOWEVER, this subscription does not apply globally, once we navigate away from app\auth\callback it will be gone
      // we're only accessing this page after the google sign in has succeded
      // so it has been simplified to if (session)
      if (session) {
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        localStorage.removeItem("redirectPath");
        router.replace(redirectPath);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // on page load, Supabase will automatically look at the URL hash and automatically set a session in cookies
  // supabaseClient.auth.getSession().then(({ data: { session } }) => {
  //   if (session) {
  //     // Supabase stores session data (especially the JWT and user identity info) in a cookie. Sometimes, this data gets too big for a single cookie (max ~4KB), so Supabase will split it into two parts:

  //     //  sb-<project-ref>-auth-token.0: This is part 1 of the token (typically the access token).
  //     // sb-<project-ref>-auth-token.1: This is part 2 (often identity data, maybe even the refresh token).

  //     // They work together as one session.

  //     console.log("Session restored:", session);
  //     const redirectPath = localStorage.getItem("redirectPath") || "/";
  //     localStorage.removeItem("redirectPath");
  //     router.push(redirectPath);
  //   } else {
  //     console.warn("No session found.");
  //     // router.push("/login");
  //   }
  // });
}

// even though we're subscribed to auth changes in the header (aka if the session changes) we still need this because:
// It’s the return URI Supabase redirects to after Google signs in the user
// The Supabase client-side session/auth-change listener in the layout only sees the session after that cookie is set
