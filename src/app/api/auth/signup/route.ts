import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Creates a new account server-side, pre-confirmed, with no email involved.
 *
 * Supabase's own `auth.signUp()` — even with the dashboard's "Confirm email"
 * toggle off — has been observed to still attempt a confirmation email on
 * every signup and hit the project's (very low, shared) email-send rate
 * limit, which then blocks account creation entirely. This is a known
 * Supabase quirk (auth email sending isn't cleanly gated by that toggle in
 * every version). `auth.admin.createUser` is a different code path: a
 * direct, service-role user creation that never sends email at all, so it
 * isn't subject to that limit — the reliable option until real SMTP is
 * configured (see supabase/migrations and .env.example for that path).
 *
 * The client still completes its own signInWithPassword right after this
 * succeeds, so the browser's Supabase client sets up the session/cookies
 * itself rather than this route trying to hand off a session.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  // This bypasses Supabase's own signup email-rate-limit as a side effect,
  // so it needs its own abuse guard in its place.
  const { success } = rateLimit(`auth-signup:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your details." },
      { status: 422 }
    );
  }

  const { fullName, email, password } = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Sign-up isn't configured yet. Please try again later." },
      { status: 503 }
    );
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    if (error.code === "email_exists" || error.status === 422) {
      return NextResponse.json(
        { error: "An account with that email already exists. Try signing in instead." },
        { status: 409 }
      );
    }
    console.error("Admin createUser failed:", error.message);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
