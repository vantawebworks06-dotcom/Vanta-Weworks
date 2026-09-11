"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { WebsiteConcept } from "@/lib/validations/concept";
import { PreviewRenderer } from "@/components/visualizer/preview/preview-renderer";
import { DEVICE_WIDTHS, type Device } from "@/components/visualizer/device-switcher";

/**
 * Isolated preview container. The AI only ever produces validated data
 * (WebsiteConcept), never markup or scripts, so this is safe without a full
 * iframe sandbox — real isolation here means "can't visually clash with the
 * host page," which a scoped, theme-driven container achieves directly.
 *
 * The generated site is usually much taller than the frame, so this scrolls
 * internally rather than pushing the whole page down — with a visible
 * "scroll for more" cue (only shown while there's unseen content below) so
 * that isn't mistaken for the preview having cut off after the hero.
 */
export function PreviewFrame({ concept, device }: { concept: WebsiteConcept; device: Device }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(true);

  function recompute() {
    const el = scrollRef.current;
    if (!el) return;
    setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
  }

  // Re-check whenever a new concept renders (new generation/edit resets
  // scroll to the top and content height changes) and whenever images
  // finish loading and grow the layout.
  useEffect(() => {
    const el = scrollRef.current;
    el?.scrollTo({ top: 0 });
    recompute();
    const id = window.setTimeout(recompute, 400); // after late-loading images settle
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run per generated concept, not per render
  }, [concept]);

  useEffect(() => {
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  return (
    <div className="flex justify-center overflow-x-auto rounded-b-xl bg-black/30 p-4 sm:p-8">
      <div
        className="w-full overflow-hidden rounded-lg shadow-2xl transition-[max-width] duration-300"
        style={{ maxWidth: DEVICE_WIDTHS[device] }}
      >
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={recompute}
            className="max-h-[80vh] min-h-[420px] overflow-y-auto scroll-smooth"
          >
            <PreviewRenderer concept={concept} />
          </div>

          {hasMoreBelow ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center pb-2"
              aria-hidden="true"
            >
              <div className="h-16 w-full bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute mb-1 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                Scroll for more
                <ChevronDown className="h-3 w-3 animate-bounce" />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
