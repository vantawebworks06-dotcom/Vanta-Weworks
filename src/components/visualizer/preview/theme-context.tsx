"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { IndustryKey, Theme } from "@/lib/validations/concept";

type PreviewMeta = { theme: Theme; industryKey: IndustryKey };

const PreviewThemeContext = createContext<PreviewMeta | null>(null);

export function PreviewThemeProvider({
  theme,
  industryKey,
  children,
}: {
  theme: Theme;
  industryKey: IndustryKey;
  children: ReactNode;
}) {
  return <PreviewThemeContext.Provider value={{ theme, industryKey }}>{children}</PreviewThemeContext.Provider>;
}

function usePreviewMeta(): PreviewMeta {
  const meta = useContext(PreviewThemeContext);
  if (!meta) throw new Error("usePreviewTheme/useIndustryKey must be used within PreviewThemeProvider");
  return meta;
}

export function usePreviewTheme(): Theme {
  return usePreviewMeta().theme;
}

/** The AI-classified business category driving which stock-photo keywords
 * the preview's imagery pulls from — see src/lib/visualizer/industry-visuals.ts. */
export function useIndustryKey(): IndustryKey {
  return usePreviewMeta().industryKey;
}

const CARD_RADIUS: Record<Theme["borderRadius"], string> = {
  none: "0px",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  full: "2rem",
};

const BUTTON_RADIUS: Record<Theme["borderRadius"], string> = {
  none: "0px",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "1rem",
  full: "9999px",
};

const FONT_STACKS: Record<Theme["fontStyle"], string> = {
  modern: "var(--font-sans), ui-sans-serif, sans-serif",
  minimal: "var(--font-sans), ui-sans-serif, sans-serif",
  bold: "var(--font-display), ui-sans-serif, sans-serif",
  classic: "Georgia, 'Times New Roman', serif",
  elegant: "Georgia, 'Times New Roman', serif",
};

export function cardRadius(theme: Theme): string {
  return CARD_RADIUS[theme.borderRadius];
}

/** Simple relative-luminance check to pick a readable foreground for a given background. */
export function readableTextOn(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
}

export function buttonStyle(theme: Theme, variant: "primary" | "secondary" = "primary"): CSSProperties {
  const radius = theme.buttonStyle === "pill" ? "9999px" : BUTTON_RADIUS[theme.borderRadius];
  const color = variant === "primary" ? theme.primaryColor : theme.secondaryColor;

  if (theme.buttonStyle === "outline") {
    return {
      borderRadius: radius,
      border: `2px solid ${color}`,
      color,
      background: "transparent",
      fontFamily: FONT_STACKS[theme.fontStyle],
    };
  }

  if (theme.buttonStyle === "gradient") {
    return {
      borderRadius: radius,
      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
      color: readableTextOn(theme.primaryColor),
      border: "none",
      fontFamily: FONT_STACKS[theme.fontStyle],
    };
  }

  return {
    borderRadius: radius,
    background: color,
    color: readableTextOn(color),
    border: "none",
    fontFamily: FONT_STACKS[theme.fontStyle],
  };
}

export function fontFamilyFor(theme: Theme): string {
  return FONT_STACKS[theme.fontStyle];
}

export function headingWeightFor(theme: Theme): CSSProperties["fontWeight"] {
  return theme.fontStyle === "bold" ? 700 : theme.fontStyle === "elegant" ? 500 : 600;
}
