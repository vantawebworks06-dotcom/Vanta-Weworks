import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < clamped ? "fill-gold text-gold" : "fill-transparent text-white/20"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
