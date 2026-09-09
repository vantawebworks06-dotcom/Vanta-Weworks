import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
  as: Comp = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
}) {
  return (
    <Comp className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>
      {children}
    </Comp>
  );
}
