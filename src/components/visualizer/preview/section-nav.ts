import type { Section } from "@/lib/validations/concept";

/** Smooth-scrolls to a section rendered by PreviewRenderer, by the id
 * PreviewRenderer stamped onto its wrapper. Scoped to the preview's own
 * scrollable frame implicitly — scrollIntoView bubbles to whichever
 * ancestor actually scrolls, no ref plumbing needed. */
export function scrollToSection(id: string | null | undefined) {
  if (!id || typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV_LABELS: Partial<Record<Section["type"], string>> = {
  services: "Services",
  features: "Services",
  about: "About",
  gallery: "Gallery",
  testimonials: "Reviews",
  faq: "FAQ",
  contact: "Contact",
};

export type NavLink = { label: string; id: string };

/** Builds the preview's nav links from whichever sections the concept
 * actually has (skipping hero/cta, which aren't nav destinations), labeled
 * from the section's own heading when it wrote one — so navigation matches
 * this specific business rather than a fixed "Home/About/Services/Contact"
 * list every time. Capped at 4 so the nav bar stays uncluttered. */
export function buildNavLinks(sections: Section[]): NavLink[] {
  const links: NavLink[] = [];
  for (const section of sections) {
    if (section.type === "hero" || section.type === "cta") continue;
    const fallbackLabel = NAV_LABELS[section.type];
    if (!fallbackLabel) continue;
    const heading = "heading" in section && section.heading ? section.heading : fallbackLabel;
    links.push({ label: heading, id: section.id });
    if (links.length >= 4) break;
  }
  return links;
}

/** Where a hero/CTA "primary" button should jump to: the main
 * listing/services section if there is one, else the contact section. */
export function primaryTargetId(sections: Section[]): string | null {
  const listing = sections.find((s) => s.type === "services" || s.type === "features");
  if (listing) return listing.id;
  return contactTargetId(sections);
}

export function contactTargetId(sections: Section[]): string | null {
  return sections.find((s) => s.type === "contact")?.id ?? null;
}
