import { cn } from "@/lib/utils/cn";

/**
 * Visible marker for seeded/placeholder content (concept portfolio items,
 * sample testimonials) so visitors are never led to believe illustrative
 * content is a real client or endorsement. Remove once real content
 * replaces the row (or the row is deleted) via the admin dashboard.
 */
export function ExampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold",
        className
      )}
    >
      Example
    </span>
  );
}
