"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import { visualizerPresets, visualizeRequestSchema, type VisualizeRequestValues } from "@/lib/validations/visualizer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const inputClass =
  "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:bg-white/[0.07] focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground/90";

export type VisualizerFormValues = VisualizeRequestValues;

export function VisualizerForm({
  onSubmit,
  initialValues,
  errorMessage,
}: {
  onSubmit: (values: VisualizerFormValues) => void;
  initialValues?: Partial<VisualizerFormValues>;
  errorMessage?: string | null;
}) {
  const [values, setValues] = useState<VisualizerFormValues>({
    businessName: initialValues?.businessName ?? "",
    description: initialValues?.description ?? "",
    industry: initialValues?.industry ?? "",
    style: initialValues?.style ?? "",
    colors: initialValues?.colors ?? "",
    features: initialValues?.features ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof VisualizerFormValues>(key: K, value: VisualizerFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(preset: (typeof visualizerPresets)[number]) {
    setValues({
      businessName: preset.businessName,
      description: preset.description,
      industry: preset.industry,
      style: preset.style,
      colors: preset.colors,
      features: preset.features,
    });
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validated = visualizeRequestSchema.safeParse(values);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(validated.error.flatten().fieldErrors)) {
        if (messages?.[0]) fieldErrors[key] = messages[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(validated.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground/90">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {visualizerPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-medium text-foreground/80 transition-colors hover:border-border-strong hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="businessName" className={labelClass}>
          Business name <span className="text-accent-2">*</span>
        </label>
        <input
          id="businessName"
          type="text"
          required
          value={values.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          placeholder="e.g. Golden Palm"
          className={inputClass}
          aria-invalid={!!errors.businessName}
          aria-describedby={errors.businessName ? "businessName-error" : undefined}
        />
        {errors.businessName ? (
          <p id="businessName-error" className="mt-1 text-xs text-red-300">
            {errors.businessName}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Describe your website idea <span className="text-accent-2">*</span>
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="e.g. I own a luxury Jamaican restaurant. I want a dark elegant website with large food photography, online reservations, and a gold accent."
          className={cn(inputClass, "resize-y")}
          maxLength={600}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description ? (
            <p id="description-error" className="text-xs text-red-300">
              {errors.description}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted">{values.description.length}/600</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="industry" className={labelClass}>
            Industry
          </label>
          <input
            id="industry"
            type="text"
            value={values.industry}
            onChange={(e) => update("industry", e.target.value)}
            placeholder="e.g. Restaurant, Legal, Real Estate"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="style" className={labelClass}>
            Preferred style
          </label>
          <input
            id="style"
            type="text"
            value={values.style}
            onChange={(e) => update("style", e.target.value)}
            placeholder="e.g. Dark and elegant, minimalist"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="colors" className={labelClass}>
            Preferred colors
          </label>
          <input
            id="colors"
            type="text"
            value={values.colors}
            onChange={(e) => update("colors", e.target.value)}
            placeholder="e.g. Black and gold"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="features" className={labelClass}>
            Features you want
          </label>
          <input
            id="features"
            type="text"
            value={values.features}
            onChange={(e) => update("features", e.target.value)}
            placeholder="e.g. Online reservations, photo gallery, contact form"
            className={inputClass}
          />
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" variant="gradient" size="lg" className="w-full sm:w-fit">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Visualize My Website
      </Button>
    </form>
  );
}
