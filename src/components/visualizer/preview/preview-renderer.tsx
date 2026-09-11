import type { Section, WebsiteConcept } from "@/lib/validations/concept";
import { PreviewThemeProvider, fontFamilyFor } from "@/components/visualizer/preview/theme-context";
import { HeroPreview } from "@/components/visualizer/preview/hero";
import { ServicesPreview } from "@/components/visualizer/preview/services";
import { AboutPreview } from "@/components/visualizer/preview/about";
import { TestimonialsPreview } from "@/components/visualizer/preview/testimonials";
import { GalleryPreview } from "@/components/visualizer/preview/gallery";
import { CtaPreview } from "@/components/visualizer/preview/cta";
import { ContactPreview } from "@/components/visualizer/preview/contact";
import { FaqPreview } from "@/components/visualizer/preview/faq";
import { PreviewNav } from "@/components/visualizer/preview/preview-nav";
import { PreviewFooter } from "@/components/visualizer/preview/preview-footer";
import { buildNavLinks, contactTargetId, primaryTargetId } from "@/components/visualizer/preview/section-nav";

type ScrollTargets = { primary: string | null; contact: string | null };

function renderSection(section: Section, targets: ScrollTargets) {
  switch (section.type) {
    case "hero":
      return <HeroPreview section={section} primaryTargetId={targets.primary} secondaryTargetId={targets.contact} />;
    case "services":
    case "features":
      return <ServicesPreview section={section} />;
    case "about":
      return <AboutPreview section={section} />;
    case "testimonials":
      return <TestimonialsPreview section={section} />;
    case "gallery":
      return <GalleryPreview section={section} />;
    case "cta":
      return <CtaPreview section={section} targetId={targets.contact ?? targets.primary} />;
    case "contact":
      return <ContactPreview section={section} />;
    case "faq":
      return <FaqPreview section={section} />;
    default:
      return null;
  }
}

/**
 * Renders a validated WebsiteConcept using our own trusted components —
 * the AI only ever supplies data (validated by Zod upstream), never markup
 * or code, so there is nothing here for it to break out of.
 */
export function PreviewRenderer({ concept }: { concept: WebsiteConcept }) {
  const navLinks = buildNavLinks(concept.sections);
  const targets: ScrollTargets = {
    primary: primaryTargetId(concept.sections),
    contact: contactTargetId(concept.sections),
  };

  return (
    <PreviewThemeProvider theme={concept.theme} industryKey={concept.industryKey}>
      <div style={{ fontFamily: fontFamilyFor(concept.theme), background: concept.theme.backgroundColor }}>
        <PreviewNav
          businessName={concept.businessName}
          theme={concept.theme}
          navLinks={navLinks}
          homeId={concept.sections[0]?.id}
        />
        {concept.sections.map((section) => (
          <div key={section.id} id={section.id}>
            {renderSection(section, targets)}
          </div>
        ))}
        <PreviewFooter businessName={concept.businessName} theme={concept.theme} />
      </div>
    </PreviewThemeProvider>
  );
}
