import Image from "next/image";
import { BrowserMockup } from "@/components/ui/browser-mockup";
import { getMediaUrl } from "@/lib/utils/media";

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
 * Project preview shown inside a browser-window frame. Renders the real
 * cover screenshot when one exists (via `coverImagePath`, a path in the
 * Supabase "media" bucket); otherwise falls back to an abstract, deterministic
 * gradient "screenshot" placeholder — an intentional stand-in, not a
 * fabricated product photo.
 */
export function ProjectPreview({
  seed,
  label,
  coverImagePath,
  className,
}: {
  seed: string;
  label: string;
  coverImagePath?: string | null;
  className?: string;
}) {
  const imageUrl = getMediaUrl(coverImagePath);

  return (
    <BrowserMockup className={className}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Screenshot of the ${label} website`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-8"
          style={{ background: gradientFor(seed) }}
        >
          <span className="text-center font-display text-lg font-medium text-white/70 sm:text-xl">
            {label}
          </span>
        </div>
      )}
    </BrowserMockup>
  );
}
