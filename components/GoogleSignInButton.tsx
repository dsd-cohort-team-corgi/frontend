"use client";

import React, { useEffect } from "react";
import supabaseClient from "@/lib/supabase";

export default function GoogleSignInButton() {
  // Save the current path before loging so they get sent back to the right page

  const handleLoginWithSupabase = async () => {
    // placed in useEffect because Supabase relies on window.location under the hood
    // and google oAuth also relies on window.google
    // We use useEffect to ensure rendering has happened on the client side,
    // so the window object is available, avoiding hydration errors

    if (typeof window === "undefined") return;

    const result = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
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

    if (result.error) console.error("Login failed:", result.error);
    // supabase handles the session, and stores it in localStorage.
  };

  useEffect(() => {
    // Now safe to access window and localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectPath", window.location.pathname);
      console.log("Origin:", window.location.origin);
    }

    // to render the google button according to google's strict specifications:
    // the script tag is in layout, we have to wait for the window to load the google script which does the button rendering
    // I used the javaScript version so I could pass our callback easily handleLoginWithSupabase and the styling is easier to understand and change
    //  {theme: "outline", size: "large", ....}
    // https://blog.designly.biz/create-a-google-login-button-with-no-dependencies-in-react-next-js
    // https://developers.google.com/identity/gsi/web/guides/display-button#button_rendering
    // const interval = setInterval(() => {
    //   const googleReady =
    //     typeof window !== "undefined" &&
    //     window.google &&
    //     window.google.accounts &&
    //     window.google.accounts.id;

    //   const buttonDiv = document.getElementById("google-signin-btn");

    //   if (googleReady && buttonDiv) {
    //     clearInterval(interval);
    //     // now that window.google is loaded, stop checking
    //     window.google.accounts.id.initialize({
    //       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    //       callback: handleLoginWithSupabase, // Function to pass the token to supabase
    //     });

    //     window.google.accounts.id.renderButton(
    //       document.getElementById("google-signin-btn"),
    //       {
    //         theme: "outline",
    //         size: "large",
    //         type: "standard",
    //         shape: "pill",
    //         text: "continue_with",
    //         width: "480px",
    //       },
    //     );
    //   }
    // }, 300);
  }, []); // Empty dependency array ensures this runs once after mount

  return (
    <button type="button" onClick={handleLoginWithSupabase}>
      Sign in with Google
    </button>
  );
}
