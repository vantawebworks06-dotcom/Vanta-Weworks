import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="text-gradient-brand">Vanta</span> Webworks
    </Link>
  );
}
