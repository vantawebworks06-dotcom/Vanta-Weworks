import { BrowserMockup } from "@/components/ui/browser-mockup";

const GRADIENTS = [
  "linear-gradient(135deg, #7c5cff 0%, #2b1a5e 100%)",
  "linear-gradient(135deg, #22d3ee 0%, #0f2f3a 100%)",
  "linear-gradient(135deg, #d8b45f 0%, #2a2114 100%)",
  "linear-gradient(135deg, #5b8def 0%, #14213d 100%)",
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

/**
 * Abstract, deterministic gradient "screenshot" placeholder for a project
 * that has no real cover image yet. Not a fabricated product photo — an
 * intentionally abstract stand-in, clearly not a real screenshot.
 */
export function ProjectPreview({
  seed,
  label,
  className,
}: {
  seed: string;
  label: string;
  className?: string;
}) {
  return (
    <BrowserMockup className={className}>
      <div
        className="flex h-full w-full items-center justify-center p-8"
        style={{ background: gradientFor(seed) }}
      >
        <span className="text-center font-display text-lg font-medium text-white/70 sm:text-xl">
          {label}
        </span>
      </div>
    </BrowserMockup>
  );
}
