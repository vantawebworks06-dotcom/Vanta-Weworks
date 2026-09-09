"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { services } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/app/admin/projects/actions";
import type { Project } from "@/lib/data/projects";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export function ProjectForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Project>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, null);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-accent-2">*</span>
          </label>
          <input id="title" name="title" required defaultValue={defaultValues?.title} className={inputClass} />
          {fieldErrors.title ? <p className="mt-1 text-xs text-red-300">{fieldErrors.title}</p> : null}
        </div>
        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug <span className="text-accent-2">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={defaultValues?.slug}
            placeholder="my-project-name"
            className={inputClass}
          />
          {fieldErrors.slug ? <p className="mt-1 text-xs text-red-300">{fieldErrors.slug}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Summary
        </label>
        <textarea id="summary" name="summary" rows={2} defaultValue={defaultValues?.summary ?? ""} className={inputClass} />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Full description
        </label>
        <textarea id="content" name="content" rows={4} defaultValue={defaultValues?.content ?? ""} className={inputClass} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="client_name" className={labelClass}>
            Client name
          </label>
          <input id="client_name" name="client_name" defaultValue={defaultValues?.client_name ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="industry" className={labelClass}>
            Industry
          </label>
          <input id="industry" name="industry" defaultValue={defaultValues?.industry ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <p className={labelClass}>Services provided</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {services.map((service) => (
            <label key={service.slug} className="flex items-center gap-2 text-sm text-foreground/85">
              <input
                type="checkbox"
                name="services_provided"
                value={service.slug}
                defaultChecked={defaultValues?.services_provided?.includes(service.slug)}
                className="h-4 w-4 rounded border-border-strong bg-white/5 accent-[var(--accent)]"
              />
              {service.title}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="technologies" className={labelClass}>
          Technologies (comma-separated)
        </label>
        <input
          id="technologies"
          name="technologies"
          defaultValue={defaultValues?.technologies?.join(", ")}
          placeholder="Next.js, Tailwind CSS, Supabase"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="results" className={labelClass}>
          Results / outcome
        </label>
        <input id="results" name="results" defaultValue={defaultValues?.results ?? ""} className={inputClass} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="project_url" className={labelClass}>
            Live project URL
          </label>
          <input id="project_url" name="project_url" defaultValue={defaultValues?.project_url ?? ""} className={inputClass} />
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
          Published (visible on the public site)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/85">
          <input
            type="checkbox"
            name="is_placeholder"
            defaultChecked={defaultValues?.is_placeholder ?? false}
            className="h-4 w-4 rounded border-border-strong bg-white/5 accent-[var(--accent)]"
          />
          Mark as example/placeholder (shows an &quot;Example&quot; badge)
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
