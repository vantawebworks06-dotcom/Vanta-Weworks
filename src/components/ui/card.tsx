import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-surface/60 backdrop-blur-sm transition-colors duration-300 hover:border-border-strong",
        className
      )}
      {...props}
    />
  );
}
