import { createBrowserClient } from "@supabase/ssr";
import { mockSupabaseClient } from "./mockClient";

export function createClient() {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    return mockSupabaseClient;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
