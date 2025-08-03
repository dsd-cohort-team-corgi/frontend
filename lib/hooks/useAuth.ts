import { useEffect, useState } from "react";
import supabase from "../supabase";

interface UserSession {
  id: string;
  email: string;
}

export default function useAuth() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
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

      if (session?.user) {
        setUserSession({
          id: session.user.id,
          email: session.user.email || "",
        });
      } else {
        setUserSession(null);
      }
      setLoading(false);
    };

    getCurrentUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession({
          id: session.user.id,
          email: session.user.email || "",
        });
      } else {
        setUserSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { userSession, loading };
}
