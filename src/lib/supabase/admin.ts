import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Service-role Supabase client. Bypasses Row Level Security — use ONLY in
 * trusted server-side code (API route handlers, server actions) that needs
 * to write to tables with no public RLS policy, such as visualization
 * requests, generated concepts, and leads.
 *
 * Never import this into a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
 * with a NEXT_PUBLIC_ prefix — the `server-only` import above makes any
 * accidental client-bundle import fail at build time instead.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
