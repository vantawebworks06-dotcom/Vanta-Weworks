"use client";

import { useState } from "react";
import { Bug, ChevronDown } from "lucide-react";
import type { WebsiteConcept } from "@/lib/validations/concept";
import { INDUSTRY_LABELS, imageKeywordFor } from "@/lib/visualizer/industry-visuals";
import { cn } from "@/lib/utils/cn";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  services: "Services/Listings",
  features: "Features/Listings",
  about: "About",
  testimonials: "Testimonials",
  gallery: "Gallery",
  faq: "FAQ",
  cta: "CTA",
  contact: "Contact",
};

/**
 * Shows what the AI actually classified this concept as, so it's obvious at
 * a glance whether it understood the prompt — separate from judging the
 * generated copy/design itself. Defaults open during development; collapse
 * or remove the default-open behavior once this is no longer needed
 * day-to-day (see the toggle button below).
 */
export function DebugPanel({ concept }: { concept: WebsiteConcept }) {
  const [open, setOpen] = useState(true);
  const hero = concept.sections.find((s) => s.type === "hero");
  const listing = concept.sections.find((s) => s.type === "services" || s.type === "features");
  const listingSection = listing && (listing.type === "services" || listing.type === "features") ? listing : null;
  const structure = concept.sections.map((s) => SECTION_LABELS[s.type] ?? s.type).join(" → ");
  const imageCategory = imageKeywordFor(concept.industryKey, hero?.id ?? concept.sections[0]?.id ?? "hero");

  return (
    <div className="overflow-hidden rounded-xl border border-dashed border-accent-2/40 bg-accent-2/5 text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-accent-2"
      >
        <span className="flex items-center gap-1.5 font-medium">
          <Bug className="h-3.5 w-3.5" aria-hidden="true" />
          Generation Debug Info
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open ? (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-accent-2/20 px-4 py-3 sm:grid-cols-2">
          <Row label="Detected Business" value={concept.businessName} />
          <Row label="Business Type" value={`${INDUSTRY_LABELS[concept.industryKey]} (${concept.industryKey})`} />
          <Row label="Style" value={concept.style} />
          <Row
            label="Theme"
            value={concept.theme.fontStyle + " · " + concept.theme.buttonStyle + " buttons"}
            swatches={[concept.theme.primaryColor, concept.theme.secondaryColor]}
          />
          <Row label="Structure" value={structure} full />
          <Row label="Number of Sections" value={String(concept.sections.length)} />
          <Row
            label="Listing Section"
            value={listingSection ? `${listingSection.heading ?? "(untitled)"} — ${listingSection.isSampleData ? "sample data" : "no pricing"}` : "none"}
          />
          <Row label="Image Category" value={imageCategory} />
          <Row label="Primary CTA" value={hero?.primaryCta ?? "—"} />
        </dl>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  full,
  swatches,
}: {
  label: string;
  value: string;
  full?: boolean;
  swatches?: string[];
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-accent-2/70">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 break-words text-foreground/85">
        {swatches
          ? swatches.map((c) => (
              <span key={c} className="h-3 w-3 shrink-0 rounded-full border border-white/20" style={{ background: c }} />
            ))
          : null}
        {value}
      </dd>
    </div>
  );
}
