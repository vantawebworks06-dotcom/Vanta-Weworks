import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Route Handlers, and
 * Server Actions. Uses the anon key + the request's cookies, so RLS
 * policies still apply based on the signed-in user (if any).
 *
 * Never use the service_role key here unless you specifically need to
 * bypass RLS for a trusted, server-only operation.
 */
export async function createClient() {
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
            // Called from a Server Component without a mutable cookie store
            // (e.g. during static rendering). Safe to ignore if you have
            // middleware refreshing the session.
          }
        },
      },
    }
  );
}
