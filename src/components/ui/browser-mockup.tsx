import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Stylized browser-window frame used as an abstract project preview when no
 * real screenshot exists yet. Renders arbitrary gradient/content children
 * inside the "screen" area rather than pulling in external stock imagery.
 */
export function BrowserMockup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#0a0b10] shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-[16/10] w-full">{children}</div>
    </div>
  );
}
