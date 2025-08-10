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

  // useCallback is used so these won't always be recreated, otherwise our useMemo will break
  // useCallback(fn, deps) returns a memoized version of a function — meaning React won't recreate the function unless the dependencies change, which it won't since we just did ann empty dependency array []

  // why useCallback?
  // so React components that consume the context don’t re-render unless the actual BOOKING value changes

  // Let’s say you're not using useCallback. Then on every render, updateBooking and resetBooking are brand new functions. Even if booking hasn't changed, the useMemo sees the object { booking, updateBooking, resetBooking } as new, because its function values are new.
  // So useMemo ends up pointlessly recomputing, and your context consumers may re-render anyway.

  // Analogy:
  //  useMemo is like saying: “Only bake a new cake if one of the ingredients changed.”
  // But if you toss in a freshly scrambled egg every time (i.e., a new function), it bakes a new cake anyway.
  // useCallback keeps that egg the same egg unless you say otherwise

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
    // getClaims is faster, since it requires not network request since it decodes the JWT locally
    // the con to it, is the metadata within in it can be stale
    // however it's very fast so it will make the app more responsive for the components that just need that basic information

    const { data: claimsData } = await supabase.auth.getClaims();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userMetaDataFromJWT: Record<string, any> = {};

    if (claimsData?.claims) {
      // if we switch tabs, Supabase's onAuthStateChange can run, for example if its checking if session/token is still valid
      // so this logic will run again
      // if the metadatacache is empty, then we know this is the 1st loop so we're freshly decoding the JWT
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

    // Step 2: get fresh metadata from Supabase (this is slower but more up to date)
    const {
      data: { user: freshUser },
    } = await supabase.auth.getUser();

    if (freshUser?.user_metadata) {
      const freshMeta = freshUser.user_metadata;
      const metaDataChanged = Object.entries(freshMeta).some(([key, value]) => {
        return cachedMetaData.current[key] !== value;
      });

      if (metaDataChanged) {
        updateAuthContext({
          phoneNumber: freshMeta.phone || "",
          displayName: freshMeta.full_name || "",
          avatarUrl: freshMeta.picture || "",
        });
        cachedMetaData.current = freshMeta;
      }
    }

    // Step 3: grab users address information (optional - don't fail auth if this fails)
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/me`,
        {
          headers,
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000), // 5 second timeout
        },
      );

      if (response.ok) {
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
      } else {
        console.warn(
          `Address fetch failed with status ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      // Don't fail auth if address fetch fails - just log the error
      console.warn("Address fetch failed, but continuing with auth:", error);
    }
  };

  // ###### Grab existing session on intial render of the app #####

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, check if there's already an active session
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession?.user) {
          // If we already have a session, update context immediately
          await updateWithJWTDataOrSupabaseData();
          // Mark auth as complete since we found an existing session
          updateAuthContext({ hasCompletedAuthCheck: true });
        } else {
          // No existing session, proceed with normal initialization
          await updateWithJWTDataOrSupabaseData();
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        // Continue with auth even if there are errors
      } finally {
        // Mark that we've completed the initial auth check - this is critical!
        updateAuthContext({ hasCompletedAuthCheck: true });
      }
    };

    // Add a more frequent check for the first few seconds to catch OAuth callbacks
    const quickSessionCheck = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await updateWithJWTDataOrSupabaseData();
          updateAuthContext({ hasCompletedAuthCheck: true });
        }
      } catch (error) {
        console.warn("Quick session check failed:", error);
      }
    };

    initializeAuth();

    // Check for session changes more frequently during the first few seconds
    const quickCheck1 = setTimeout(quickSessionCheck, 100);
    const quickCheck2 = setTimeout(quickSessionCheck, 500);
    const quickCheck3 = setTimeout(quickSessionCheck, 1000);

    return () => {
      clearTimeout(quickCheck1);
      clearTimeout(quickCheck2);
      clearTimeout(quickCheck3);
    };
  }, [updateAuthContext]);

  // ### listen for auth changes after page load automatically ######

  // since context is in the root layout it will load when the app mounts

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          // this will be triggered by
          // 1. the user was logged out on page load and signed in later
          // 2. Supabase refreshing token/session automatically, keeping the app in sync
          await updateWithJWTDataOrSupabaseData();
        } else {
          // triggered by
          // 1. User signing out manually
          // 2. Session becoming invalid/expired
          resetAuthContext();
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        // Continue with auth even if there are errors
      } finally {
        // Always mark auth check as complete
        updateAuthContext({ hasCompletedAuthCheck: true });
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
