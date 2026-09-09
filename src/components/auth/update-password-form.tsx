"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updatePasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const validated = updatePasswordSchema.safeParse({
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

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
    const { error } = await supabase.auth.updateUser({ password: validated.data.password });
    setSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="password" className={labelClass}>
          New password
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
          Confirm new password
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
        {errors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-300">{errors.confirmPassword}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="md" disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Update Password
      </Button>
    </form>
  );
}
