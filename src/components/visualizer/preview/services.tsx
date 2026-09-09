import type { ServicesSection } from "@/lib/validations/concept";
import { usePreviewTheme, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";
import { resolveIcon } from "@/components/visualizer/preview/icon-map";

export function ServicesPreview({ section }: { section: ServicesSection }) {
  const theme = usePreviewTheme();

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-4xl">
        {section.heading ? (
          <div className="mb-10 text-center">
            <h2
              className="text-2xl sm:text-3xl"
              style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
            >
              {section.heading}
            </h2>
            {section.description ? (
              <p className="mx-auto mt-3 max-w-xl text-sm opacity-70 sm:text-base" style={{ color: theme.textColor }}>
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
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: theme.textColor }}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm opacity-70" style={{ color: theme.textColor }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={i}
                className="p-6"
                style={
                  section.variant === "cards"
                    ? { background: `${theme.textColor}08`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}14` }
                    : undefined
                }
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center"
                  style={{ background: `${theme.primaryColor}1a`, borderRadius: cardRadius(theme) }}
                >
                  <Icon className="h-5 w-5" style={{ color: theme.primaryColor }} aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold" style={{ color: theme.textColor }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-70" style={{ color: theme.textColor }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
