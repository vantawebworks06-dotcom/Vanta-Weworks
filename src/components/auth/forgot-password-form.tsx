"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { friendlyAuthEmailError } from "@/lib/utils/auth-errors";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const validated = forgotPasswordSchema.safeParse({ email: String(formData.get("email") ?? "") });
    if (!validated.success) {
      setErrorMessage(validated.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
      // Use the browser's own origin rather than an env var — see the
      // same note in signup-form.tsx.
      redirectTo: `${window.location.origin}/auth/confirm?type=recovery`,
    });
    setSubmitting(false);

    // Supabase never reveals "no account with that email" through this
    // call (it returns success either way), so surfacing its error here
    // can't be used to enumerate registered accounts — it can only ever
    // mean a real service problem (rate limit, misconfigured email
    // sending, network failure). Silently claiming success on a genuine
    // failure left people staring at "check your email" for an email that
    // was never sent, with no way to know something was actually wrong.
    if (error) {
      setErrorMessage(friendlyAuthEmailError(error));
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent-2" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-muted">
          If an account exists for that address, we&apos;ve sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>

      {errorMessage ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="md" disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Send Reset Link
      </Button>
    </form>
  );
}
