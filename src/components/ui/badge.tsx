import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
