"use client";

import React from "react";
import supabaseClient from "@/lib/supabase";

export default function GoogleSignInButton() {
  // Save the current path before loging so they get sent back to the right page

  const handleLoginWithSupabase = async () => {
    // placed in useEffect because Supabase relies on window.location under the hood
    // and google oAuth also relies on window.google
    // We use useEffect to ensure rendering has happened on the client side,
    // so the window object is available, avoiding hydration errors

    if (typeof window === "undefined") return;
    const redirectPath = window.location.pathname;
    // lets make sure we're entirely signed out for a fresh log in
    // this will avoid errors with supabase accidently using an invalid old session for api calls
    // auth.signOut logs out of client
    await supabaseClient.auth.signOut({ scope: "global" });
    // auth.signInWithOAuth logs out on server

    const result = await supabaseClient.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback?redirectPath=${redirectPath}`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
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
    console.log(JSON.stringify(result));
    if (result.error) console.error("Login failed:", result.error);
    // supabase handles the session, and stores it in localStorage.
  };

  return (
    <button type="button" onClick={handleLoginWithSupabase}>
      Sign in with Google
    </button>
  );
}
