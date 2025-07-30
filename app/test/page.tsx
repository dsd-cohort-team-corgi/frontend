"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ShowBearerToken() {
  const [stateToken, setStateToken] = useState(null);
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
        setStateToken(token);

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

  return (
    <p>
      Check the console for the Bearer token or view here:{" "}
      {stateToken || "No token found. User may not be signed in."}
    </p>
  );
}
