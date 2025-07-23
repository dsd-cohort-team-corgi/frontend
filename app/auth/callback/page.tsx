"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import supabaseClient from "@/lib/supabase";

// needs to be a page.tsx not a route.ts because supabaseClient.auth.getSession() is using client side logic
// otherwise they'll be an error because route.ts is just for api handlers

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  //   const router = useRouter();

  // Supabase will look at the URL hash and automatically set a session in cookies
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      // Supabase stores session data (especially the JWT and user identity info) in a cookie. Sometimes, this data gets too big for a single cookie (max ~4KB), so Supabase will split it into two parts:

      //  sb-<project-ref>-auth-token.0: This is part 1 of the token (typically the access token).
      // sb-<project-ref>-auth-token.1: This is part 2 (often identity data, maybe even the refresh token).

      // They work together as one session.

      console.log("Session restored:", session);
      // 👇 You could also save user info in context or global state here
      // router.push("/dashboard");  or wherever your app should go next
    } else {
      console.warn("No session found.");
      // router.push("/login");
    }
  });
}
