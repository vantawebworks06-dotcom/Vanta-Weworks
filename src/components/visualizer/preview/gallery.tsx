import type { GallerySection } from "@/lib/validations/concept";
import { usePreviewTheme, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";
import { GradientPlaceholder } from "@/components/visualizer/preview/gradient-placeholder";

export function GalleryPreview({ section }: { section: GallerySection }) {
  const theme = usePreviewTheme();
  const count = Math.min(9, Math.max(1, section.imageCount));

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-4xl">
        {section.heading ? (
          <h2
            className="mb-8 text-center text-2xl sm:text-3xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h2>
        ) : null}
        <div
          className={
            section.variant === "masonry"
              ? "columns-2 gap-3 sm:columns-3"
              : "grid grid-cols-2 gap-3 sm:grid-cols-3"
          }
        >
          {Array.from({ length: count }).map((_, i) => (
            <GradientPlaceholder
              key={i}
              seed={`${section.id}-${i}`}
              className={
                section.variant === "masonry"
                  ? `mb-3 w-full break-inside-avoid ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`
                  : "aspect-square w-full"
              }
              style={{ borderRadius: cardRadius(theme) }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
