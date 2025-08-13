import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default supabase;

// made it return an object rather than it being a function call so we'' only have one supabase client object active in the app. So its a stable reference, react won't recreate it per render
