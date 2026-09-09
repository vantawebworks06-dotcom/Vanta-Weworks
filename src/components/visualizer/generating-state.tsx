"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Understanding your concept...",
  "Building the visual direction...",
  "Creating your preview...",
];

/**
 * Rotates through reassuring status copy while a generation request is in
 * flight. This is not real progress — there's no percentage the API can
 * give us — so it's presented as a sequence of activity, not a progress bar.
 */
export function GeneratingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-border bg-surface/60 px-8 py-20 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span
          className="absolute inset-0 animate-pulse rounded-full opacity-40 blur-xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden="true"
        />
        <Loader2 className="relative h-8 w-8 animate-spin text-accent-2" aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-medium text-foreground">{MESSAGES[index]}</p>
      <p className="max-w-xs text-sm text-muted">
        This usually takes 15–30 seconds. Please don&apos;t close this tab.
      </p>
    </div>
  );
}
