"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { services } from "@/lib/data/services";
import { budgetRanges, timelineOptions, contactFormSchema } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      serviceInterested: String(formData.get("serviceInterested") ?? ""),
      budgetRange: String(formData.get("budgetRange") ?? ""),
      preferredTimeline: String(formData.get("preferredTimeline") ?? ""),
      message: String(formData.get("message") ?? ""),
      companyWebsite: String(formData.get("companyWebsite") ?? ""),
    };

    const validated = contactFormSchema.safeParse(payload);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(validated.error.flatten().fieldErrors)) {
        if (messages?.[0]) fieldErrors[key] = messages[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
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
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface/60 p-10 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-accent-2" aria-hidden="true" />
        <h3 className="font-display text-xl font-semibold">Message sent</h3>
        <p className="max-w-sm text-sm text-muted">
          Thanks for reaching out — we&apos;ll review your project details and get back to you
          shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — hidden from real users, visible to naive bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Leave this field empty</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-accent-2">*</span>
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name ? <FieldError id="name-error">{errors.name}</FieldError> : null}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-accent-2">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email ? <FieldError id="email-error">{errors.email}</FieldError> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Business name
          </label>
          <input id="company" name="company" type="text" autoComplete="organization" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="websiteUrl" className={labelClass}>
            Current website URL
          </label>
          <input id="websiteUrl" name="websiteUrl" type="text" placeholder="https://" className={inputClass} />
        </div>
        <div>
          <label htmlFor="serviceInterested" className={labelClass}>
            Service you&apos;re interested in
          </label>
          <select
            id="serviceInterested"
            name="serviceInterested"
            className={inputClass}
            defaultValue={searchParams.get("service") ?? ""}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budgetRange" className={labelClass}>
            Budget range
          </label>
          <select id="budgetRange" name="budgetRange" className={inputClass} defaultValue="">
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="preferredTimeline" className={labelClass}>
            Preferred timeline
          </label>
          <select id="preferredTimeline" name="preferredTimeline" className={inputClass} defaultValue="">
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
        <label htmlFor="message" className={labelClass}>
          Project description <span className="text-accent-2">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={20}
          placeholder="Tell us about your business and what you're looking for..."
          className={cn(inputClass, "resize-y")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? <FieldError id="message-error">{errors.message}</FieldError> : null}
      </div>

      {status === "error" && errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="lg" disabled={status === "submitting"} className="w-full sm:w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-red-300">
      {children}
    </p>
  );
}
