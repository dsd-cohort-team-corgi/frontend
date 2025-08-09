"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { authContextObject } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if auth context has been initialized (either with user data or empty object)
    const isAuthInitialized =
      Object.keys(authContextObject).length > 0 ||
      authContextObject.supabaseUserId;

    if (isAuthInitialized !== undefined) {
      // Add a small delay to show the loading screen briefly
      const timer = setTimeout(() => {
        setIsLoading(false);
        setAuthLoading(false);
      }, 2500); // Show for at least 2.5 seconds

      return () => clearTimeout(timer);
    }

    // If auth is not initialized, set loading to false after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAuthLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [authContextObject]);

  if (isLoading || authLoading) {
    return <LoadingScreen />;
  }

  return children;
}

export default LoadingWrapper;
