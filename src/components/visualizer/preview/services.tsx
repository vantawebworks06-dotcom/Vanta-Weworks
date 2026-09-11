import type { ServicesSection } from "@/lib/validations/concept";
import { usePreviewTheme, buttonStyle, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";
import { resolveIcon } from "@/components/visualizer/preview/icon-map";
import { GradientPlaceholder } from "@/components/visualizer/preview/gradient-placeholder";

export function ServicesPreview({ section }: { section: ServicesSection }) {
  const theme = usePreviewTheme();
  // "Sample" content — illustrative inventory/listings/pricing (vehicles,
  // menu items, properties) rather than generic service descriptions — gets
  // a photo per card and a small label so it never reads as the visitor's
  // real data. See the "isSampleData" doc comment in concept.ts.
  const isListing = section.isSampleData;

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-4xl">
        {section.heading || isListing ? (
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            {section.heading ? (
              <h2
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
              >
                {section.heading}
              </h2>
            ) : null}
            {isListing ? (
              <span
                className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                style={{ background: `${theme.textColor}0f`, color: theme.textColor, opacity: 0.65 }}
              >
                Sample listings — illustrative only
              </span>
            ) : null}
            {section.description ? (
              <p className="mx-auto mt-1 max-w-xl text-sm opacity-70 sm:text-base" style={{ color: theme.textColor }}>
                {section.description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          className={
            section.variant === "list"
              ? "flex flex-col divide-y"
              : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          }
          style={section.variant === "list" ? { borderColor: `${theme.textColor}1a` } : undefined}
        >
          {section.items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            if (section.variant === "list") {
              return (
                <div key={i} className="flex items-start gap-4 py-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.primaryColor }} aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-base font-semibold" style={{ color: theme.textColor }}>
                        {item.title}
                      </h3>
                      {item.price ? (
                        <span className="text-sm font-semibold" style={{ color: theme.primaryColor }}>
                          {item.price}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm opacity-70" style={{ color: theme.textColor }}>
                      {item.description}
                    </p>
                    {item.meta ? (
                      <p className="mt-1 text-xs opacity-50" style={{ color: theme.textColor }}>
                        {item.meta}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={i}
                className="overflow-hidden"
                style={
                  section.variant === "cards"
                    ? { background: `${theme.textColor}08`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}14` }
                    : undefined
                }
              >
                {isListing ? (
                  <GradientPlaceholder seed={`${section.id}-${i}`} delayMs={i * 150} className="aspect-[4/3] w-full" />
                ) : null}
                <div className="p-6">
                  {!isListing ? (
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center"
                      style={{ background: `${theme.primaryColor}1a`, borderRadius: cardRadius(theme) }}
                    >
                      <Icon className="h-5 w-5" style={{ color: theme.primaryColor }} aria-hidden="true" />
                    </div>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold" style={{ color: theme.textColor }}>
                      {item.title}
                    </h3>
                    {item.price ? (
                      <span
                        className="shrink-0 text-base font-semibold"
                        style={{ color: theme.primaryColor, fontFamily: fontFamilyFor(theme) }}
                      >
                        {item.price}
                      </span>
                    ) : null}
                  </div>
                  {item.meta ? (
                    <p className="mt-1 text-xs opacity-50" style={{ color: theme.textColor }}>
                      {item.meta}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed opacity-70" style={{ color: theme.textColor }}>
                    {item.description}
                  </p>
                  {item.ctaLabel ? (
                    <button
                      type="button"
                      className="mt-4 w-full px-4 py-2.5 text-xs font-medium"
                      style={buttonStyle(theme, "primary")}
                    >
                      {item.ctaLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
