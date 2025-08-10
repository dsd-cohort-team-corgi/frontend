"use client";

// This must be a client component, because Supabase sets the session from a fragment URL (#access_token=...) which is only accessible in the browser
//   const router = useRouter();
// if we want to redirect the user
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabase";

// needs to be a page.tsx not a route.ts because supabaseClient.auth.getSession() is using client side logic
// otherwise they'll be an error because route.ts is just for api handlers

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#google-pre-built

export default function AuthCallback() {
  const [messageToUser, setMessageToUser] = useState(
    "Finishing signing you in ...",
  );
  const router = useRouter();

  useEffect(() => {
    // Maximum time to wait for auth completion: 10 seconds
    const maxAuthWaitTime = 10000;

    let hasRedirected = false;

    const handleRedirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      const match = document.cookie.match(/redirectPath=([^;]+)/);
      const path = match ? decodeURIComponent(match[1]) : "/";
      document.cookie = "redirectPath=; Max-Age=0; path=/"; // deleting redirect cookie
      router.replace(path);
    };

    // Safety timeout - if auth takes too long, redirect anyway
    const safetyTimeout = setTimeout(() => {
      console.warn("OAuth callback timeout reached, redirecting anyway");
      setMessageToUser("Taking longer than expected, redirecting...");
      handleRedirect();
    }, maxAuthWaitTime);

    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthCode =
      urlParams.has("code") || urlParams.has("error_description");

    const isAuthCallbackEmpty =
      typeof window !== "undefined" &&
      // we're running on the browser not the server
      !hasAuthCode;
    // if it doesn't have code or error_description, supabase won't know what to do with it, and they'll be stuck on the page with a "Finishing signing you in..." message

    if (isAuthCallbackEmpty) {
      setMessageToUser(
        "signin failed, recheck your url. No valid authentication info was found. Redirecting...",
      );
      setTimeout(() => {
        handleRedirect();
      }, 1000);
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      // normally when you're subscribing to authChange events we'd want to specify what events we'd redirect on
      //  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session)
      // HOWEVER, this subscription does not apply globally, once we navigate away from app\auth\callback it will be gone so theres little point in checking the exact event
      // why? because we're only accessing this page after the google sign in has succeeded

      // supabaseClient.auth.onAuthStateChange is used because

      // whether successful or not, we'll want to send the user back to the original page
      // but we'll pass a message to them if setting the session did fail

      if (session) {
        // so an event like "SIGNED_IN" that would fire when the user completes signing in
        // or an "intial_session" that hydrated in time
        // session is hydrated/ available
        clearTimeout(safetyTimeout);
        handleRedirect();
      } else {
        if (!isAuthCallbackEmpty) {
          // if a user is waiting to be redirected after landing at a faulty url without any hash information /auth/callback(nothinghere) then the error message  "signin failed, recheck your url. No valid authentication info was found. Redirecting..." to the user won't be overwritten with this one
          setMessageToUser("Still signing you in ...  ");
        }

        // if supabase returned INITIAL_SESSION on immediate page load, the session might still be null or incomplete since its still loading
        // INITIAL_SESSION means supabase is checking if theres an existing session cached locally or in the url token
        // subscription listens for event changes (example Initial_session => signedIn) so the code for this currentl running onAuthState will still go to the timeout below
        // but a second onAuthState will start, and see the session has updated and thus run the handleRedirect() above before the fallback setTimeOut below has finished running

        setTimeout(async () => {
          // Handling edge case of a delayed but valid session
          // getSession is a fallback in case the event isn't changing fast enough, so subscription isn't retriggering onAuthStateChange
          //  due to some odd edge case (timing, hydration, weird browswer quirks)
          // this setTimeOut buys the valid but slow session time to hydrate before we jump to handleRedirect()
          // ex 'INITIAL_SESSION', null)
          // no second 'SIGNED_IN' event ever fires (due to timing/browser issue)
          // then you're stuck with a null session, this is doing one quick recheck in case it was very delayed
          const {
            data: { session: delayedSession },
          } = await supabaseClient.auth.getSession();

          if (delayedSession) {
            clearTimeout(safetyTimeout);
            handleRedirect();
          } else {
            if (!isAuthCallbackEmpty) {
              // if a user is waiting to be redirected after landing at a faulty url without any hash information /auth/callback(nothinghere) then the error message "signin failed, recheck your url. No valid authentication info was found. Redirecting..." to the user won't be overwritten with this one
              setMessageToUser(
                "There was an error when signing you in! No session was found. Returning to previous page.",
              );
            }
            handleRedirect();
          }
        }, 500);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [router]);

  // on page load, Supabase will automatically look at the URL hash and automagically set a session in cookies
  // .getSession() wasn't working because of a timing issue, so onAuthStateChange was used instead
  // Supabase stores session data (especially the JWT and user identity info) in a cookie. Sometimes, this data gets too big for a single cookie (max ~4KB), so Supabase will split it into two parts:
  //    part 1 of the token (typically the access token) sb-<project-ref>-auth-token.
  //    part 2 (often identity data, maybe even the refresh token).
  // They work together as one session.

  return <p>{messageToUser} </p>;
}

// even though we're subscribed to auth changes in the header (aka if the session changes) we still need this because:
// It's the return URI Supabase redirects to after Google signs in the user
// The Supabase client-side session/auth-change listener in the layout only sees the session after that cookie is set
