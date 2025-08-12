"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/hooks/useAuth";

export default function AuthCallback() {
  const router = useRouter();
  const { userSession, loading } = useAuth();
  const [messageToUser, setMessageToUser] = useState(
    "Processing authentication...",
  );
  const [debugInfo, setDebugInfo] = useState("");

  // Check if this is an OAuth callback
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  const errorDescription = urlParams.get("error_description");
  const hasAuthCode = !!authCode;
  const isAuthCallbackEmpty = !hasAuthCode && !errorDescription;

  useEffect(() => {
    // Set debug info
    setDebugInfo(
      `hasAuthCode: ${hasAuthCode}, authCode: ${authCode ? authCode.substring(0, 8) + "..." : "null"}, errorDescription: ${errorDescription}, isAuthCallbackEmpty: ${isAuthCallbackEmpty}`,
    );

    // Handle authentication errors
    if (errorDescription) {
      setMessageToUser(
        `Authentication error: ${errorDescription}. Redirecting...`,
      );
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    // If no auth code, redirect
    if (isAuthCallbackEmpty) {
      setMessageToUser("No authentication code found. Redirecting...");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    // If we have an auth code, wait for useAuth to process it
    if (hasAuthCode) {
      setMessageToUser("Authentication code received. Processing...");
    }
  }, [authCode, errorDescription, hasAuthCode, isAuthCallbackEmpty, router]);

  // Handle successful authentication
  useEffect(() => {
    if (!loading && userSession) {
      console.log("User authenticated successfully:", userSession);
      setMessageToUser("Authentication successful! Redirecting...");

      // Get the redirect path from cookies or default to home
      const redirectPath =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("redirectPath="))
          ?.split("=")[1] || "/";

      // Clear the redirect path cookie
      document.cookie =
        "redirectPath=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setTimeout(() => router.push(redirectPath), 1000);
    }
  }, [userSession, loading, router]);

  // Safety timeout - redirect after 10 seconds if something goes wrong
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!userSession) {
        console.log("OAuth callback timeout reached, redirecting anyway");
        setMessageToUser("Authentication timeout. Redirecting...");
        router.push("/");
      }
    }, 10000);

    return () => clearTimeout(safetyTimeout);
  }, [userSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {messageToUser}
          </h2>
          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
            <strong>Debug Info:</strong> {debugInfo}
          </div>
        </div>
      </div>
    </div>
  );
}
