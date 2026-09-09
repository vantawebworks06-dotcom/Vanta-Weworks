import type { AboutSection } from "@/lib/validations/concept";
import { usePreviewTheme, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";
import { GradientPlaceholder } from "@/components/visualizer/preview/gradient-placeholder";

export function AboutPreview({ section }: { section: AboutSection }) {
  const theme = usePreviewTheme();

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <GradientPlaceholder seed={section.id} className="aspect-[4/3] w-full rounded-2xl md:order-2" />
        <div>
          <h2
            className="text-2xl sm:text-3xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed opacity-75 sm:text-base" style={{ color: theme.textColor }}>
            {section.description}
          </p>
        </div>
      </div>
    </section>
  );
}
