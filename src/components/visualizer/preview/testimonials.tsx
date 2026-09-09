import { Star } from "lucide-react";
import type { TestimonialsSection } from "@/lib/validations/concept";
import { usePreviewTheme, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";

export function TestimonialsPreview({ section }: { section: TestimonialsSection }) {
  const theme = usePreviewTheme();

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-4xl">
        {section.heading ? (
          <h2
            className="mb-10 text-center text-2xl sm:text-3xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h2>
        ) : null}

        <div
          className={
            section.variant === "carousel"
              ? "flex snap-x gap-5 overflow-x-auto pb-2"
              : "grid grid-cols-1 gap-5 sm:grid-cols-2"
          }
        >
          {section.items.map((item, i) => (
            <div
              key={i}
              className={section.variant === "carousel" ? "w-72 shrink-0 snap-start p-6" : "p-6"}
              style={{ background: `${theme.textColor}08`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}14` }}
            >
              {item.rating ? (
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5"
                      style={{ color: theme.primaryColor }}
                      fill={s < item.rating! ? theme.primaryColor : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              ) : null}
              <p className="text-sm italic leading-relaxed opacity-80" style={{ color: theme.textColor }}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold" style={{ color: theme.textColor }}>
                {item.name}
              </p>
              {item.role ? (
                <p className="text-xs opacity-60" style={{ color: theme.textColor }}>
                  {item.role}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
