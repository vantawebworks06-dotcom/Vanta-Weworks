"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function HandledToggle({
  id,
  initialHandled,
  action,
}: {
  id: string;
  initialHandled: boolean;
  action: (id: string, handled: boolean) => Promise<void>;
}) {
  const [handled, setHandled] = useState(initialHandled);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !handled;
    setHandled(next);
    startTransition(async () => {
      try {
        await action(id, next);
      } catch {
        setHandled(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={handled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
        handled
          ? "border-accent-2/40 bg-accent-2/10 text-accent-2"
          : "border-border-strong bg-white/5 text-muted hover:text-foreground"
      )}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      ) : (
        <Check className="h-3 w-3" aria-hidden="true" />
      )}
      {handled ? "Handled" : "Mark handled"}
    </button>
  );
}
