"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function SignupForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const validated = signupSchema.safeParse(payload);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validated.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: { full_name: validated.data.fullName },
        emailRedirectTo: `${siteConfig.url}/auth/confirm`,
      },
    });
    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
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
          We&apos;ve sent a confirmation link to finish creating your account. New accounts
          start with standard access — an existing administrator needs to grant admin access
          before you can use the dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name
        </label>
        <input id="fullName" name="fullName" type="text" required autoComplete="name" className={inputClass} />
        {errors.fullName ? <p className="mt-1 text-xs text-red-300">{errors.fullName}</p> : null}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        {errors.email ? <p className="mt-1 text-xs text-red-300">{errors.email}</p> : null}
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          className={inputClass}
        />
        {errors.password ? <p className="mt-1 text-xs text-red-300">{errors.password}</p> : null}
      </div>
      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          className={inputClass}
        />
        {errors.confirmPassword ? <p className="mt-1 text-xs text-red-300">{errors.confirmPassword}</p> : null}
      </div>

      {errorMessage ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="md" disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Create Account
      </Button>
    </form>
  );
}
