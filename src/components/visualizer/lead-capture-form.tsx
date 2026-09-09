"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { leadCaptureSchema } from "@/lib/validations/visualizer";
import { budgetRanges, timelineOptions } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

type Status = "idle" | "submitting" | "success" | "error";

export function LeadCaptureForm({ visualizationRequestId }: { visualizationRequestId?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      business: String(formData.get("business") ?? ""),
      projectDescription: String(formData.get("projectDescription") ?? ""),
      budgetRange: String(formData.get("budgetRange") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      visualizationRequestId,
      companyWebsite: String(formData.get("companyWebsite") ?? ""),
    };

    const validated = leadCaptureSchema.safeParse(payload);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(validated.error.flatten().fieldErrors)) {
        if (messages?.[0]) fieldErrors[key] = messages[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent-2" aria-hidden="true" />
        <h4 className="font-display text-base font-semibold">Thanks — we&apos;ll be in touch</h4>
        <p className="max-w-xs text-sm text-muted">
          We&apos;ve received your project details along with your website concept.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-companyWebsite">Leave this field empty</label>
        <input id="lead-companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            Name <span className="text-accent-2">*</span>
          </label>
          <input id="lead-name" name="name" required className={inputClass} />
          {errors.name ? <p className="mt-1 text-xs text-red-300">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="lead-email" className={labelClass}>
            Email <span className="text-accent-2">*</span>
          </label>
          <input id="lead-email" name="email" type="email" required className={inputClass} />
          {errors.email ? <p className="mt-1 text-xs text-red-300">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-business" className={labelClass}>
            Business name
          </label>
          <input id="lead-business" name="business" className={inputClass} />
        </div>
        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Phone
          </label>
          <input id="lead-phone" name="phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-budgetRange" className={labelClass}>
            Budget range
          </label>
          <select id="lead-budgetRange" name="budgetRange" className={inputClass} defaultValue="">
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-timeline" className={labelClass}>
            Timeline
          </label>
          <select id="lead-timeline" name="timeline" className={inputClass} defaultValue="">
            <option value="">Select a timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-projectDescription" className={labelClass}>
          Anything else we should know?
        </label>
        <textarea id="lead-projectDescription" name="projectDescription" rows={3} className={inputClass} />
      </div>

      {status === "error" && errorMessage ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="md" disabled={status === "submitting"} className="w-full sm:w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          "Submit My Project"
        )}
      </Button>
    </form>
  );
}
