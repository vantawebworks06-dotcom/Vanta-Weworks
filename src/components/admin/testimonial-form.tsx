"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/app/admin/projects/actions";
import type { Testimonial } from "@/lib/data/testimonials";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function TestimonialForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Testimonial> & { display_order?: number };
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, null);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="client_name" className={labelClass}>
            Client name <span className="text-accent-2">*</span>
          </label>
          <input id="client_name" name="client_name" required defaultValue={defaultValues?.client_name} className={inputClass} />
          {fieldErrors.client_name ? <p className="mt-1 text-xs text-red-300">{fieldErrors.client_name}</p> : null}
        </div>
        <div>
          <label htmlFor="client_title" className={labelClass}>
            Title
          </label>
          <input id="client_title" name="client_title" defaultValue={defaultValues?.client_title ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input id="company" name="company" defaultValue={defaultValues?.company ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="quote" className={labelClass}>
          Quote <span className="text-accent-2">*</span>
        </label>
        <textarea id="quote" name="quote" required rows={4} defaultValue={defaultValues?.quote} className={inputClass} />
        {fieldErrors.quote ? <p className="mt-1 text-xs text-red-300">{fieldErrors.quote}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rating" className={labelClass}>
            Rating (1–5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={defaultValues?.rating ?? 5}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="display_order" className={labelClass}>
            Display order
          </label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            min={0}
            defaultValue={defaultValues?.display_order ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground/85">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={defaultValues?.is_published ?? true}
            className="h-4 w-4 rounded border-border-strong bg-white/5 accent-[var(--accent)]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/85">
          <input
            type="checkbox"
            name="is_placeholder"
            defaultChecked={defaultValues?.is_placeholder ?? false}
            className="h-4 w-4 rounded border-border-strong bg-white/5 accent-[var(--accent)]"
          />
          Mark as example/placeholder
        </label>
      </div>

      {state?.error ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="md" disabled={isPending} className="w-fit">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
