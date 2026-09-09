import { MessageCircle } from "lucide-react";
import type { ContactSection } from "@/lib/validations/concept";
import { usePreviewTheme, buttonStyle, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";

export function ContactPreview({ section }: { section: ContactSection }) {
  const theme = usePreviewTheme();

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-lg text-center">
        {section.heading ? (
          <h2
            className="text-2xl sm:text-3xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h2>
        ) : null}
        {section.description ? (
          <p className="mt-3 text-sm opacity-70 sm:text-base" style={{ color: theme.textColor }}>
            {section.description}
          </p>
        ) : null}

        {section.showForm ? (
          <div
            className="mt-8 flex flex-col gap-3 p-6 text-left"
            style={{ background: `${theme.textColor}08`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}14` }}
          >
            {["Name", "Email", "Message"].map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium opacity-70" style={{ color: theme.textColor }}>
                  {field}
                </label>
                <div
                  className="h-9 w-full"
                  style={{ background: `${theme.textColor}0d`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}1a` }}
                />
              </div>
            ))}
            <button type="button" className="mt-2 self-start px-6 py-2.5 text-sm font-medium" style={buttonStyle(theme, "primary")}>
              Send Message
            </button>
          </div>
        ) : null}

        {section.whatsapp ? (
          <button
            type="button"
            className="mx-auto mt-6 flex items-center gap-2 px-6 py-3 text-sm font-medium"
            style={{ background: "#25D366", color: "#ffffff", borderRadius: theme.buttonStyle === "pill" ? "9999px" : cardRadius(theme) }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </button>
        ) : null}
      </div>
    </section>
  );
}
