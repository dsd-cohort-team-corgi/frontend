"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";

import supabase from "@/lib/supabase";
import { getAuthHeaders } from "@/lib/api-client";

interface AuthContextType {
  authContextObject: AuthDetailsType;
  updateAuthContext: (updates: Partial<AuthDetailsType>) => void;
  resetAuthContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authContextObject, setAuthContextObject] = useState<AuthDetailsType>(
    {},
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedMetaData = useRef<Record<string, any>>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedAddressData = useRef<Record<string, any>>({});

  // ######## Update #################

  const updateAuthContext = useCallback((updates: Partial<AuthDetailsType>) => {
    setAuthContextObject((prev) => ({ ...prev, ...updates }));
  }, []);

  // ######## Reset to {} #################

  const resetAuthContext = useCallback(() => {
    setAuthContextObject({});
  }, []);

  const memoizedAuthValue = useMemo(
    () => ({
      authContextObject,
      updateAuthContext,
      resetAuthContext,
    }),
    [authContextObject],
  );

  // ######### Automatic Auth Updates Logic  ###########

  const updateWithJWTDataOrSupabaseData = async () => {
    const isMetaDataCacheEmpty =
      Object.keys(cachedMetaData.current).length === 0;
    // Step 1: get claims for a lighting fast loading time
    const { data: claimsData } = await supabase.auth.getClaims();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userMetaDataFromJWT: Record<string, any> = {};

    if (claimsData?.claims) {
      userMetaDataFromJWT = claimsData.claims.user_metadata || {};

      if (isMetaDataCacheEmpty) {
        updateAuthContext({
          supabaseUserId: claimsData.claims.sub,
          email: claimsData.claims.email,
          phoneNumber: userMetaDataFromJWT.phone || "",
          displayName: userMetaDataFromJWT.full_name || "",
          avatarUrl: userMetaDataFromJWT.avatar_url || "",
        });
        cachedMetaData.current = userMetaDataFromJWT;
      }
    }

    // Step 2: Getting fresh metadata from supabase, and updating if any of the information has changed during the session
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const freshMeta = userData.user.user_metadata || {};

      const metadataChanged = Object.entries(freshMeta).some(([key, value]) => {
        if (isMetaDataCacheEmpty) {
          return userMetaDataFromJWT[key] !== value;
        }

        return cachedMetaData.current[key] !== value;
      });

      if (metadataChanged) {
        updateAuthContext({
          email: freshMeta.email,
          phoneNumber: freshMeta.phone || "",
          displayName: freshMeta.full_name || "",
          avatarUrl: freshMeta.picture || "",
        });
        cachedMetaData.current = freshMeta;
      }
    }

    (async () => {
      try {
        const headers = await getAuthHeaders();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/me`,
          { headers },
        );

        if (!response.ok) {
          console.warn(
            "no address information was returned from the fetch call, check if you are signed in",
          );
          return;
        }

        const data = await response.json();

        const freshAddressData = (data && data[0]) || {};

        const addressChanged = Object.entries(freshAddressData).some(
          ([key, value]) => {
            return cachedAddressData.current[key] !== value;
          },
        );

        if (addressChanged) {
          updateAuthContext({
            streetAddress1: freshAddressData.street_address_1 || "",
            streetAddress2: freshAddressData.street_address_2 || "",
            city: freshAddressData.city || "",
            state: freshAddressData.state || "",
            zip: freshAddressData.zip || "",
            customerId: freshAddressData.customer_id || "",
            addressId: freshAddressData.id,
          });
          cachedAddressData.current = freshAddressData;
        }
      } catch (error) {
        console.warn("Failed to fetch address data:", error);
      }
    })();
  };

  // ###### Grab existing session on intial render of the app #####

  useEffect(() => {
    updateWithJWTDataOrSupabaseData();
  }, [updateAuthContext]);

  // ### listen for auth changes after page load automatically ######

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateWithJWTDataOrSupabaseData();
      } else {
        resetAuthContext();
      }
    });

    return () => subscription.unsubscribe();
  }, [updateAuthContext, resetAuthContext]);

  return (
    <AuthContext.Provider value={memoizedAuthValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ############# hook we call to access/update/reset context ######

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
