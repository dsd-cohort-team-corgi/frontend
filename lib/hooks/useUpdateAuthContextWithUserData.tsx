import supabase from "@/lib/supabase";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";

export default function useUpdateAuthContextWithUserData() {
  const { updateAuthContext } = useAuthContext();

  return async function loadUserData() {
    // Step 1: get claims for a lighting fast loading time
    // getClaims is faster, since it requires not network request since it decodes the JWT locally
    // the con to it, is the metadata within in it can be stale
    // however it's very fast so it will make the app more responsive for the components that just need that basic information

    const { data: claimsData } = await supabase.auth.getClaims();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userMetaDataFromJWT: Record<string, any> = {};

    if (claimsData?.claims) {
      updateAuthContext({
        supabaseUserId: claimsData.claims.sub,
        email: claimsData.claims.email,
        phoneNumber: claimsData.claims.app_metadata.phone || "",
        displayName: claimsData.claims.app_metadata.full_name || "",
        avatarUrl: claimsData.claims.app_metadata.picture || "",
      });
      userMetaDataFromJWT = claimsData.claims.app_metadata;
    }

    // Step 2: Getting fresh metadata from supabase, and updating if any of the information has changed during the session: user changing username, password. Since the JWT doesn't update during the session itself, that information would be stale
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const freshMeta = userData.user.user_metadata || {};
      const metadataChanged = Object.entries(freshMeta).some(
        ([key, value]) => userMetaDataFromJWT[key] !== value,
      );

      // Only update context if metadata changed
      if (metadataChanged) {
        updateAuthContext({
          email: freshMeta.email,
          phoneNumber: freshMeta.phone,
          displayName: freshMeta.full_name,
          avatarUrl: freshMeta.picture,
        });
      }
    }
  };
}
