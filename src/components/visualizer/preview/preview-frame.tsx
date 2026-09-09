"use client";

import type { WebsiteConcept } from "@/lib/validations/concept";
import { PreviewRenderer } from "@/components/visualizer/preview/preview-renderer";
import { DEVICE_WIDTHS, type Device } from "@/components/visualizer/device-switcher";

/**
 * Isolated preview container. The AI only ever produces validated data
 * (WebsiteConcept), never markup or scripts, so this is safe without a full
 * iframe sandbox — real isolation here means "can't visually clash with the
 * host page," which a scoped, theme-driven container achieves directly.
 */
export function PreviewFrame({ concept, device }: { concept: WebsiteConcept; device: Device }) {
  return (
    <div className="flex justify-center overflow-x-auto rounded-b-xl bg-black/30 p-4 sm:p-8">
      <div
        className="w-full overflow-hidden rounded-lg shadow-2xl transition-[max-width] duration-300"
        style={{ maxWidth: DEVICE_WIDTHS[device] }}
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <PreviewRenderer concept={concept} />
        </div>
      </div>
    </div>
  );
}
