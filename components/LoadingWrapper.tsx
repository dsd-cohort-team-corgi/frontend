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
    const maxAuthWaitTime = 8000; // 8 seconds max wait for auth

    const timeout = setTimeout(() => {
      console.warn(
        "LoadingWrapper timeout reached, proceeding without auth completion",
      );
      setIsLoading(false);
    }, maxAuthWaitTime);

    const checkAuthStatus = () => {
      const hasUserId = authContextObject.supabaseUserId;
      const hasCompletedAuthCheck =
        authContextObject.hasCompletedAuthCheck !== undefined;

      if (hasUserId || hasCompletedAuthCheck) {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    };

    // Check immediately
    checkAuthStatus();

    // Check again after a short delay to catch any immediate updates
    const immediateCheck = setTimeout(checkAuthStatus, 100);

    return () => {
      clearTimeout(timeout);
      clearTimeout(immediateCheck);
    };
  }, [authContextObject]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
}

export default LoadingWrapper;
