import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { mockSupabaseClient } from "./mockClient";

export async function createClient() {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    return mockSupabaseClient;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled server components limitations
          }
        },
      },
    }
  );
}
