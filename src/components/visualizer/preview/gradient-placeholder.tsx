import type { CSSProperties, ReactNode } from "react";
import { usePreviewTheme } from "@/components/visualizer/preview/theme-context";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * Deterministic gradient built from the concept's own theme colors — used
 * wherever an image would go (hero background, gallery tiles) but no real
 * image is available. Intentionally abstract, never a fabricated photo.
 */
export function GradientPlaceholder({
  seed,
  className,
  style,
  children,
}: {
  seed: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const theme = usePreviewTheme();
  const angle = hashSeed(seed) % 360;

  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(${angle}deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
