"use client";

import React from "react";
import supabaseClient from "@/lib/supabase";

export default function GoogleSignInButton() {
  const handleLogin = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`, // or your deployed domain
      },
    });

    // When a user clicks on the login to google button:
    // 1. Supabase redirects your browser to Google:
    // 2. Google shows the login screen
    // 3. f the user accepts, Google redirects the user back to Supabase, not your app, with a temporary OAuth code in the URL

    // Once Google authenticates the user, Supabase:
    // 1. Exchanges the oAuth authorization code for tokens (access token, ID token / JWT). This is handled behind the scenes by supabase
    // 2. generates a supabase session (with its own access and refresh tokens)
    // 3. redirects the user to your redirectTo URL (/auth/callback) with session data in the URL fragment (#access_token=...).
    // 4. auth callback is needed because we need to catch the token from that url and persist the session on the client
    // otherwise the user won't be signed in to the app

    // 5. when on  /auth/callback  we do:
    //   supabase.auth.getSession()
    //  to read the access token (JWT) from the end of the url and store it in local storage
    //  That JWT is then used for all future Supabase requests, like: supabase.from("users").select("*"); // Automatically sends JWT in headers

    if (error) console.error("Login failed:", error);
    // supabase handles the session, and stores it in localStorage.
  };

  return (
    <button
      className="rounded border bg-white px-4 py-2 shadow-md hover:bg-gray-100"
      type="button"
      onClick={handleLogin}
    >
      Sign in with Google 🚀
    </button>
  );
}
