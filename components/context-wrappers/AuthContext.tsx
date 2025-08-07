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
      // if we switch tabs, Supabase’s onAuthStateChange can run, for example if its checking if session/token is still valid
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

    // Step 2: Getting fresh metadata from supabase, and updating if any of the information has changed during the session: user changing username, password. Since the JWT doesn't update during the session itself, that information would be stale
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const freshMeta = userData.user.user_metadata || {};

      const metadataChanged = Object.entries(freshMeta).some(([key, value]) => {
        // for the 1st run the cached metadata will be empty, in that case look at the userData we just got from the decoded JWT
        if (isMetaDataCacheEmpty) {
          return userMetaDataFromJWT[key] !== value;
        }
        // if we have cached metadata then use that instead
        // why? because I noticed when I clicked to a different website tab, and then clicked back, the context fired again twice even though the app wasn't refreshed
        // Supabase’s onAuthStateChange or some internal refresh mechanism fires, maybe checking if the session/token is still valid or has updated
        // which triggers the onAuthStateChange, which retriggers this logic
        // the JWT decoder (getClaims) gives us partial info, so when getUser runs, it thinks it found new data. But in reality that data already existed in the AuthContext
        // by using cache, we avoid this unnessary updates

        return cachedMetaData.current[key] !== value;
      });

      // Only update context if metadata changed
      // why? because any time context changes, react with rerender ALL the components that use it
      // so all the components that call the context via its hook
      // tldr: Updating with the same data causes unnecessary re-renders and slows down the app

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
    // step 3: grab users address information

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.log("failed to fetch an address");
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
      });
      cachedAddressData.current = freshAddressData;
    }
  };

  // ###### Grab existing session on intial render of the app #####

  useEffect(() => {
    updateWithJWTDataOrSupabaseData();
  }, [updateAuthContext]);

  // ### listen for auth changes after page load automatically ######

  // since context is in the root layout it will load when the app mounts

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // this will be triggered by
        // 1. the user was logged out on page load and signed in later
        // 2. Supabase refreshing token/session automatically, keeping the app in sync
        updateWithJWTDataOrSupabaseData();
      } else {
        // triggered by
        // 1. User signing out manually
        // 2. Session becoming invalid/expired
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
