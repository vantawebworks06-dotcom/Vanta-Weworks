import type { AuthError } from "@supabase/supabase-js";

/**
 * Turns a raw Supabase Auth error into copy a visitor can actually act on.
 * Supabase's own messages ("email rate limit exceeded") are accurate but
 * read like a server log — this maps the cases people actually hit
 * (mainly: the project's email sending is rate-limited or misconfigured)
 * to something that explains what happened and what to do next.
 */
export function friendlyAuthEmailError(error: AuthError): string {
  if (error.code === "over_email_send_rate_limit" || error.status === 429) {
    return "We're unable to send emails right now — our email service has hit a sending limit. Please try again in a few minutes, or contact us directly if this keeps happening.";
  }
  if (error.code === "email_address_invalid") {
    return "That email address doesn't look valid. Please double-check it and try again.";
  }
  return error.message || "Something went wrong sending that email. Please try again shortly.";
}
