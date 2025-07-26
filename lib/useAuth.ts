import { useEffect, useState } from "react";
import supabase from "./supabase";

export function useAuth() {
  const [userSession, setUserSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: claimsData } = await supabase.auth.getClaims();
        if (claimsData?.claims) {
          const userFromClaims = {
            id: claimsData.claims.sub,
            email: claimsData.claims.email,
          };
          setUserSession(userFromClaims);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("Falling back to getSession() for auth check");
      }

      // Fallback to getSession() for symmetric JWTs or if getClaims() fails
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserSession(session?.user || null);
      setLoading(false);
    };

    getCurrentUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { userSession, loading };
}
