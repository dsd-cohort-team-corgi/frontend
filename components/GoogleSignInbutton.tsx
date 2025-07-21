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
