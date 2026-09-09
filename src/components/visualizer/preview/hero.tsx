import type { HeroSection } from "@/lib/validations/concept";
import { usePreviewTheme, buttonStyle, fontFamilyFor, headingWeightFor, readableTextOn } from "@/components/visualizer/preview/theme-context";
import { GradientPlaceholder } from "@/components/visualizer/preview/gradient-placeholder";

export function HeroPreview({ section }: { section: HeroSection }) {
  const theme = usePreviewTheme();
  const onDark = readableTextOn(theme.primaryColor) === "#ffffff";

  if (section.variant === "split") {
    return (
      <section className="grid grid-cols-1 items-center gap-8 px-6 py-16 sm:px-10 sm:py-20 md:grid-cols-2 md:gap-12">
        <div>
          {section.subheading ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: theme.primaryColor }}>
              {section.subheading}
            </p>
          ) : null}
          <h1
            className="text-3xl leading-tight sm:text-4xl md:text-5xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h1>
          <p className="mt-4 text-base leading-relaxed opacity-80 sm:text-lg" style={{ color: theme.textColor }}>
            {section.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03]" style={buttonStyle(theme, "primary")}>
              {section.primaryCta}
            </button>
            {section.secondaryCta ? (
              <button type="button" className="px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80" style={{ color: theme.textColor, background: "transparent", border: `1px solid ${theme.textColor}33` }}>
                {section.secondaryCta}
              </button>
            ) : null}
          </div>
        </div>
        <GradientPlaceholder seed={section.id} className="aspect-[4/3] w-full rounded-2xl" />
      </section>
    );
  }

  const align = section.variant === "minimal" ? "text-left items-start" : "text-center items-center";

  return (
    <section
      className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28"
      style={
        section.variant === "luxury" || section.variant === "bold"
          ? { background: `linear-gradient(160deg, ${theme.primaryColor}, ${theme.backgroundColor})` }
          : { background: theme.backgroundColor }
      }
    >
      <div className={`relative mx-auto flex max-w-2xl flex-col ${align}`}>
        {section.subheading ? (
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: section.variant === "luxury" || section.variant === "bold" ? (onDark ? "#ffffffcc" : "#111111cc") : theme.primaryColor }}
          >
            {section.subheading}
          </p>
        ) : null}
        <h1
          className={section.variant === "bold" ? "text-4xl leading-[1.05] sm:text-6xl" : "text-3xl leading-tight sm:text-5xl"}
          style={{
            fontFamily: fontFamilyFor(theme),
            fontWeight: headingWeightFor(theme),
            color: section.variant === "luxury" || section.variant === "bold" ? (onDark ? "#ffffff" : "#111111") : theme.textColor,
          }}
        >
          {section.heading}
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{
            color: section.variant === "luxury" || section.variant === "bold" ? (onDark ? "#ffffffb3" : "#111111b3") : `${theme.textColor}cc`,
          }}
        >
          {section.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="px-7 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]" style={buttonStyle(theme, "primary")}>
            {section.primaryCta}
          </button>
          {section.secondaryCta ? (
            <button
              type="button"
              className="px-7 py-3.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                color: section.variant === "luxury" || section.variant === "bold" ? (onDark ? "#fff" : "#111") : theme.textColor,
                border: `1px solid ${section.variant === "luxury" || section.variant === "bold" ? (onDark ? "#ffffff55" : "#11111155") : `${theme.textColor}33`}`,
              }}
            >
              {section.secondaryCta}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
