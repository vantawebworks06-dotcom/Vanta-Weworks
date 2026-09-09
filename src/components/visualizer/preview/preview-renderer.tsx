import type { Section, WebsiteConcept } from "@/lib/validations/concept";
import { PreviewThemeProvider, fontFamilyFor } from "@/components/visualizer/preview/theme-context";
import { HeroPreview } from "@/components/visualizer/preview/hero";
import { ServicesPreview } from "@/components/visualizer/preview/services";
import { AboutPreview } from "@/components/visualizer/preview/about";
import { TestimonialsPreview } from "@/components/visualizer/preview/testimonials";
import { GalleryPreview } from "@/components/visualizer/preview/gallery";
import { CtaPreview } from "@/components/visualizer/preview/cta";
import { ContactPreview } from "@/components/visualizer/preview/contact";
import { PreviewNav } from "@/components/visualizer/preview/preview-nav";
import { PreviewFooter } from "@/components/visualizer/preview/preview-footer";

function renderSection(section: Section) {
  switch (section.type) {
    case "hero":
      return <HeroPreview section={section} />;
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
      return <CtaPreview section={section} />;
    case "contact":
      return <ContactPreview section={section} />;
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
  return (
    <PreviewThemeProvider theme={concept.theme}>
      <div style={{ fontFamily: fontFamilyFor(concept.theme), background: concept.theme.backgroundColor }}>
        <PreviewNav businessName={concept.businessName} theme={concept.theme} />
        {concept.sections.map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}
        <PreviewFooter businessName={concept.businessName} theme={concept.theme} />
      </div>
    </PreviewThemeProvider>
  );
}
