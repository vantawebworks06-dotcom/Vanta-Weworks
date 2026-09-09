"use client";

import { useState, type FormEvent } from "react";
import { Wand2, Undo2, Redo2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "Make it more luxurious",
  "Change the primary color to dark blue",
  "Add a testimonials section",
  "Make the hero section larger",
  "Make the design more minimal",
];

export function EditBar({
  onSubmit,
  submitting,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  errorMessage,
}: {
  onSubmit: (instruction: string) => void;
  submitting: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  errorMessage?: string | null;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-surface/60 p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Wand2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-2" aria-hidden="true" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tell us what you'd like to change..."
            maxLength={300}
            disabled={submitting}
            className="w-full rounded-full border border-border bg-white/5 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent-2 focus:outline-none disabled:opacity-60"
          />
        </div>
        <Button type="submit" variant="gradient" size="md" disabled={submitting || !value.trim()}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Apply Change
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              disabled={submitting}
              className="rounded-full border border-border bg-white/5 px-3 py-1 text-[11px] text-muted transition-colors hover:text-foreground disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo || submitting}
            aria-label="Undo"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-30"
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo || submitting}
            aria-label="Redo"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-30"
          >
            <Redo2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={submitting}
            aria-label="Reset to original"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-30"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {errorMessage ? <p className="text-xs text-red-300">{errorMessage}</p> : null}
    </div>
  );
}
