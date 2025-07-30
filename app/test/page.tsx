"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabase";

export default function ShowBearerToken() {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        const token = session?.access_token;

        if (token) {
          console.log(" Bearer Token:", token);
        } else {
          console.warn("No token found. User may not be signed in.");
        }
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, []);

  return <p>Check the console for the Bearer token </p>;
}
