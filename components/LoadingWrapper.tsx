"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import supabase from "@/lib/supabase";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const maxAuthWaitTime = 3000;

    const timeout = setTimeout(() => {
      console.warn("LoadingWrapper timeout reached, proceeding anyway");
      setIsLoading(false);
    }, maxAuthWaitTime);

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("LoadingWrapper: Found valid session, proceeding");
          clearTimeout(timeout);
          setIsLoading(false);
        } else {
          setTimeout(checkSession, 500);
        }
      } catch (error) {
        console.warn("LoadingWrapper: Session check failed:", error);
        clearTimeout(timeout);
        setIsLoading(false);
      }
    };

    checkSession();

    const intervalChecks = [
      setTimeout(checkSession, 200),
      setTimeout(checkSession, 500),
      setTimeout(checkSession, 1000),
      setTimeout(checkSession, 1500),
    ];

    return () => {
      clearTimeout(timeout);
      intervalChecks.forEach(clearTimeout);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
}

export default LoadingWrapper;
