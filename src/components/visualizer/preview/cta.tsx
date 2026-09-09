import type { CtaSection } from "@/lib/validations/concept";
import { usePreviewTheme, buttonStyle, fontFamilyFor, headingWeightFor, readableTextOn } from "@/components/visualizer/preview/theme-context";

export function CtaPreview({ section }: { section: CtaSection }) {
  const theme = usePreviewTheme();
  const textColor = readableTextOn(theme.primaryColor);

  return (
    <section
      className="px-6 py-16 text-center sm:px-10 sm:py-20"
      style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
    >
      <div className="mx-auto max-w-xl">
        <h2
          className="text-2xl sm:text-3xl"
          style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: textColor }}
        >
          {section.heading}
        </h2>
        {section.description ? (
          <p className="mt-3 text-sm opacity-90 sm:text-base" style={{ color: textColor }}>
            {section.description}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-7 px-7 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]"
          style={{ ...buttonStyle(theme, "primary"), background: textColor === "#ffffff" ? "#ffffff" : "#111111", color: textColor === "#ffffff" ? "#111111" : "#ffffff" }}
        >
          {section.buttonLabel}
        </button>
      </div>
    </section>
  );
}
