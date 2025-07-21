"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import supabaseClient from "@/lib/supabase";

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  //   const router = useRouter();

  // Supabase will look at the URL hash and set session
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      console.log("Session restored:", session);
      // 👇 You could also save user info in context or global state here
      // router.push("/dashboard");  or wherever your app should go next
    } else {
      console.warn("No session found.");
      // router.push("/login");
    }
  });
}
