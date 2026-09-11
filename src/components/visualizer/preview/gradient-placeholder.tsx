"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
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
 */
export function GradientPlaceholder({
  seed,
  className,
  style,
  children,
  photo = true,
}: {
  seed: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Set false for purely decorative uses that shouldn't fetch a photo. */
  photo?: boolean;
}) {
  const theme = usePreviewTheme();
  const industryKey = useIndustryKey();
  const [imageFailed, setImageFailed] = useState(false);
  const angle = hashSeed(seed) % 360;
  const showPhoto = photo && !imageFailed;

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
          src={stockImageUrl(industryKey, seed, 900, 700)}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {children}
    </div>
  );
}
