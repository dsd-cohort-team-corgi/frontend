import { createBrowserClient } from "@supabase/ssr";
// To access Supabase from Client Components, which run in the browser.

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // keeps it across reloads, won't get lost even with a fast refresh
      autoRefreshToken: true,
    },
  },
);

export default supabase;

// made it return an object rather than it being a function call so we'' only have one supabase client object active in the app. So its a stable reference, react won't recreate it per render
// 1. client is stateful (it tracks the current session, listeners, etc.)
// 2. if we had multiple supbase clients, there could be multiple event subscriptions/ duplicate auth states
