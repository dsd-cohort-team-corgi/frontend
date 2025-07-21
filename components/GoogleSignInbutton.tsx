"use client";

import React, { useEffect } from "react";

export default function GoogleSignInbutton() {
  // useEffect makes sure the GSI library is loaded before trying to render the button

  const handleCredentialResponse = async (response: any) => {
    console.log("Google ID token:", response.credential);

    // Send this token to your Supabase+FastAPI backend
    try {
      const responseFromServer = await fetch(
        "https://maidyoulook-backend.onrender.com/api/auth/google-id-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // sends cookies
          body: JSON.stringify({ id_token: response.credential }),
        },
      );
      const dataAsJSON = await responseFromServer.json();
      console.log(" Backend returned this google data:", dataAsJSON);
      const userData = dataAsJSON.user;
    } catch {
      if (!response.ok) {
        throw new Error("Auth failed");
      }
    }
  };

  useEffect(() => {
    // https://blog.designly.biz/create-a-google-login-button-with-no-dependencies-in-react-next-js
    const interval = setInterval(() => {
      const googleReady =
        typeof window !== "undefined" &&
        window.google &&
        window.google.accounts &&
        window.google.accounts.id;

      const buttonDiv = document.getElementById("google-signin-btn");

      if (googleReady && buttonDiv) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse, // Function to handle the ID token
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "pill",
          },
        );
      }
    }, 300);
  }, []); // Empty dependency array ensures this runs once after mount

  return (
    <>
      {/* https://supabase.com/docs/guides/auth/social-login/auth-google#google-pre-built */}
      <div id="google-signin-btn" />
      {/* <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="googleSignIn"
        data-nonce=""
        data-auto_prompt="false"
        data-use_fedcm_for_prompt="true"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
        data-width="300"
      /> */}
    </>
  );
}
