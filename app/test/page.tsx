"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ShowBearerToken() {
  const [stateToken, setStateToken] = useState<undefined | string>(undefined);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async () => {
    if (!stateToken) return;
    try {
      await navigator.clipboard.writeText(stateToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy token:", err);
    }
  };

  return (
    <div>
      <p>
        Check the console for the Bearer token or view here:{" "}
        {stateToken && "token found!"}{" "}
        {!stateToken && "No token found. User may not be signed in."}
      </p>
      {stateToken && (
        <button
          type="button"
          onClick={handleCopy}
          style={{
            marginTop: "0.5rem",
            padding: "0.4rem 0.8rem",
            backgroundColor: copied ? "#4ade80" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy Token"}
        </button>
      )}
    </div>
  );
}
