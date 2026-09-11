"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { heroDemoConfigs, type HeroDemoConfig } from "@/lib/data/hero-demo";
import { BrowserMockup } from "@/components/ui/browser-mockup";
import { cn } from "@/lib/utils/cn";

const VISIBLE_MS = 6200;
const TRANSITION_MS = 700;

const FONT_STACK: Record<HeroDemoConfig["theme"]["font"], string> = {
  sans: "var(--font-sans), ui-sans-serif, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

/**
 * The homepage hero's "live website preview" — rotates through a handful of
 * structured demo configs (see src/lib/data/hero-demo.ts), rendering each as
 * a small but genuinely distinct miniature website inside the existing
 * BrowserMockup frame. All configs stay mounted simultaneously (visibility
 * toggled via opacity/transform) so their images load once and stay cached
 * across the whole rotation, rather than being re-fetched on every change.
 */
export function HeroWebsiteDemo() {
  const [index, setIndex] = useState(0);
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroDemoConfigs.length);
      setJustChanged(true);
      const clear = setTimeout(() => setJustChanged(false), TRANSITION_MS + 400);
      return () => clearTimeout(clear);
    }, VISIBLE_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <DemoStatusLabel changing={justChanged} />

      <BrowserMockup className="shadow-[0_40px_120px_-40px_rgba(124,92,255,0.45)]">
        <div className="relative h-full w-full">
          {heroDemoConfigs.map((config, i) => (
            <div
              key={config.slug}
              aria-hidden={i !== index}
              className="absolute inset-0 transition-all ease-out"
              style={{
                transitionDuration: `${TRANSITION_MS}ms`,
                opacity: i === index ? 1 : 0,
                transform: i === index ? "scale(1) translateY(0)" : "scale(0.98) translateY(6px)",
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <MiniSite config={config} />
            </div>
          ))}
        </div>
      </BrowserMockup>
    </div>
  );
}

function DemoStatusLabel({ changing }: { changing: boolean }) {
  return (
    <div className="pointer-events-none absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0b10] px-3.5 py-1.5 text-[11px] font-medium text-muted shadow-lg">
        <span
          className={cn("h-1.5 w-1.5 rounded-full", changing ? "bg-gold" : "bg-accent-2")}
          style={{ boxShadow: `0 0 8px ${changing ? "var(--gold)" : "var(--accent-2)"}` }}
          aria-hidden="true"
        />
        AI Website Preview
        <span className="text-white/30">·</span>
        <span className={changing ? "text-gold" : "text-accent-2"}>{changing ? "Generating" : "AI Generated"}</span>
      </span>
    </div>
  );
}

function MiniSite({ config }: { config: HeroDemoConfig }) {
  const { theme } = config;
  const fontFamily = FONT_STACK[theme.font];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" style={{ background: theme.surface, fontFamily }}>
      {/* Nav */}
      <div
        className="flex shrink-0 items-center justify-between border-b px-3 py-2 sm:px-5 sm:py-2.5"
        style={{ borderColor: `${theme.text}14`, background: theme.surface }}
      >
        <span className="truncate text-[9px] font-semibold sm:text-xs" style={{ color: theme.text }}>
          {config.businessName}
        </span>
        <div className="hidden items-center gap-3 sm:flex">
          {config.nav.map((item) => (
            <span key={item} className="text-[9px] opacity-60 sm:text-[10px]" style={{ color: theme.text }}>
              {item}
            </span>
          ))}
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[8px] font-medium sm:px-2.5 sm:py-1 sm:text-[9px]"
          style={{ background: theme.primary, color: readable(theme.primary) }}
        >
          {config.primaryCta}
        </span>
      </div>

      {/* Hero */}
      <div className="relative flex shrink-0 basis-[42%] items-center overflow-hidden sm:basis-[46%]">
        <Image
          src={config.heroImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${theme.text}e6 0%, ${theme.text}80 42%, transparent 78%)` }} />
        <div className="relative z-[1] max-w-[70%] px-3 sm:px-6">
          <h3
            className="text-[13px] font-semibold leading-tight text-white sm:text-2xl md:text-3xl"
            style={{ fontFamily }}
          >
            {config.headline}
          </h3>
          <p className="mt-1 hidden text-[10px] leading-snug text-white/80 sm:block sm:text-sm">{config.subheadline}</p>
          <span
            className="mt-1.5 inline-block rounded-full px-2.5 py-1 text-[8px] font-semibold sm:mt-4 sm:px-5 sm:py-2 sm:text-xs"
            style={{ background: theme.primary, color: readable(theme.primary) }}
          >
            {config.primaryCta}
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2 sm:px-5 sm:py-3" style={{ background: theme.surface }}>
        <div className="flex items-center justify-between">
          <h4 className="text-[9px] font-semibold sm:text-xs" style={{ color: theme.text }}>
            {config.sectionHeading}
          </h4>
          {config.filters ? (
            <div className="hidden gap-1 sm:flex">
              {config.filters.map((f, i) => (
                <span
                  key={f}
                  className="rounded-full px-2 py-0.5 text-[8px]"
                  style={{
                    background: i === 0 ? theme.primary : `${theme.text}0d`,
                    color: i === 0 ? readable(theme.primary) : theme.text,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={cn("mt-1.5 grid gap-1.5 sm:mt-2.5 sm:gap-3", config.layout === "showcase-grid" ? "grid-cols-3" : "grid-cols-3")}>
          {config.cards.map((card) => (
            <CardTile key={card.title} card={card} theme={theme} fontFamily={fontFamily} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardTile({
  card,
  theme,
  fontFamily,
}: {
  card: HeroDemoConfig["cards"][number];
  theme: HeroDemoConfig["theme"];
  fontFamily: string;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-md border sm:rounded-lg"
      style={{ borderColor: `${theme.text}1a`, background: `${theme.text}05` }}
    >
      <div className="relative aspect-[4/3] w-full shrink-0">
        <Image src={card.image} alt="" fill sizes="200px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-1.5 sm:gap-1 sm:p-2.5">
        <p className="truncate text-[8px] font-semibold sm:text-[11px]" style={{ color: theme.text, fontFamily }}>
          {card.title}
        </p>
        <p className="hidden truncate text-[7px] opacity-60 sm:block sm:text-[9px]" style={{ color: theme.text }}>
          {card.meta}
        </p>
        <div className="mt-auto flex items-center justify-between gap-1 pt-0.5 sm:pt-1">
          {card.price ? (
            <span className="text-[8px] font-semibold sm:text-[10px]" style={{ color: theme.primary }}>
              {card.price}
            </span>
          ) : (
            <span />
          )}
          <span
            className="truncate rounded-full px-1.5 py-0.5 text-[6.5px] font-medium sm:px-2 sm:text-[8px]"
            style={{ background: theme.primary, color: readable(theme.primary) }}
          >
            {card.cta}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Simple relative-luminance check to pick a readable foreground color. */
function readable(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
}
