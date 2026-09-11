"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqSection } from "@/lib/validations/concept";
import { usePreviewTheme, cardRadius, fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";

export function FaqPreview({ section }: { section: FaqSection }) {
  const theme = usePreviewTheme();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-6 py-16 sm:px-10 sm:py-20" style={{ background: theme.backgroundColor }}>
      <div className="mx-auto max-w-2xl">
        {section.heading ? (
          <h2
            className="mb-8 text-center text-2xl sm:text-3xl"
            style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
          >
            {section.heading}
          </h2>
        ) : null}

        <div
          className="flex flex-col divide-y"
          style={{ borderColor: `${theme.textColor}1a`, borderRadius: cardRadius(theme), border: `1px solid ${theme.textColor}14` }}
        >
          {section.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold" style={{ color: theme.textColor }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 transition-transform duration-300"
                    style={{ color: theme.primaryColor, transform: isOpen ? "rotate(180deg)" : undefined }}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed opacity-70" style={{ color: theme.textColor }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
