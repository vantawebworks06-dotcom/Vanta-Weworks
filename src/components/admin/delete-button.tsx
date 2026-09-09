"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({
  id,
  action,
  confirmMessage = "Delete this item? This can't be undone.",
  label = "Delete",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      await action(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : <Trash2 className="h-3 w-3" aria-hidden="true" />}
      {label}
    </button>
  );
}
