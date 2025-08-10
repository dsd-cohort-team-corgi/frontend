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

  useEffect(() => {
    // Check if auth context has been initialized
    // We consider it initialized when we have either:
    // 1. A user ID (meaning user is logged in)
    // 2. An empty context but auth check has completed (meaning user is not logged in)
    const hasUserId = authContextObject.supabaseUserId;
    const hasCompletedAuthCheck =
      authContextObject.hasCompletedAuthCheck !== undefined;

    // If we have a user ID or we've completed the auth check, we're ready
    if (hasUserId || hasCompletedAuthCheck) {
      setIsLoading(false);
    }
  }, [authContextObject]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
}

export default LoadingWrapper;
