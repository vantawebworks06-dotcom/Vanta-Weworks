import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  href,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
}) {
  const content = (
    <Card className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <Icon className="h-4 w-4 text-accent-2" aria-hidden="true" />
      </div>
      <span className="font-display text-3xl font-semibold text-foreground">{value}</span>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
