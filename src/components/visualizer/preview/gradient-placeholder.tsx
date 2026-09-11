"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePreviewTheme, useIndustryKey } from "@/components/visualizer/preview/theme-context";
import { stockImageUrl } from "@/lib/visualizer/industry-visuals";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * Visual placeholder for the AI Visualizer preview — a deterministic
 * gradient built from the concept's own theme colors, with an illustrative,
 * industry-relevant stock photo layered on top by default (see
 * src/lib/visualizer/industry-visuals.ts). Never a fabricated photo of the
 * visitor's actual business: just topic-matched demo imagery, with the
 * gradient as both the loading state and the fallback if the photo fails to
 * load, so this never renders broken.
 *
 * The free photo source this pulls from is best-effort — under a burst of
 * concurrent requests (many placeholders mounting at once) it occasionally
 * fails a fetch. Two things make that a non-issue: a staggered start
 * (`delayMs`, set by the caller based on index) so a whole grid doesn't hit
 * it in the same instant, and one automatic retry with a fresh URL before
 * giving up and settling on the gradient.
 */
export function GradientPlaceholder({
  seed,
  className,
  style,
  children,
  photo = true,
  delayMs = 0,
}: {
  seed: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Set false for purely decorative uses that shouldn't fetch a photo. */
  photo?: boolean;
  /** Staggers when this tile starts fetching its photo, so a grid of many
   * placeholders doesn't burst-request all at once. */
  delayMs?: number;
}) {
  const theme = usePreviewTheme();
  const industryKey = useIndustryKey();
  const [attempt, setAttempt] = useState(0); // 0 = not started, 1 = first try, 2 = retry
  const [failed, setFailed] = useState(false);
  const angle = hashSeed(seed) % 360;

  useEffect(() => {
    if (!photo) return;
    const timer = setTimeout(() => setAttempt(1), delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only re-runs if `photo` flips
  }, [photo]);

  const imageUrl =
    attempt === 1
      ? stockImageUrl(industryKey, seed, 900, 700)
      : attempt === 2
        ? stockImageUrl(industryKey, seed, 900, 700, true) // retry via a different proxy/CDN path
        : null;
  const showPhoto = photo && !failed && imageUrl;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(${angle}deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        ...style,
      }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, runtime-determined URL; not known at build time for next/image
        <img
          key={imageUrl}
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => {
            if (attempt === 1) setAttempt(2); // one retry with a fresh URL
            else setFailed(true); // give up, keep the gradient
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {children}
    </div>
  );
}
