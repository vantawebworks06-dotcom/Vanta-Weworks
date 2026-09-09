"use client";

import type { Theme } from "@/lib/validations/concept";

const STYLE_PRESETS = ["luxury", "minimal", "bold", "corporate", "playful", "elegant"];
const RADIUS_OPTIONS: Theme["borderRadius"][] = ["none", "sm", "md", "lg", "full"];
const BUTTON_OPTIONS: Theme["buttonStyle"][] = ["solid", "outline", "gradient", "pill"];
const FONT_OPTIONS: Theme["fontStyle"][] = ["modern", "classic", "elegant", "minimal", "bold"];

const selectClass =
  "w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-xs text-foreground transition-colors focus:border-accent-2 focus:outline-none capitalize";
const labelClass = "mb-1.5 block text-xs font-medium text-foreground/80";

export function DesignControls({
  theme,
  style,
  onThemeChange,
  onStyleChange,
}: {
  theme: Theme;
  style: string;
  onThemeChange: (theme: Theme) => void;
  onStyleChange: (style: string) => void;
}) {
  function update<K extends keyof Theme>(key: K, value: Theme[K]) {
    onThemeChange({ ...theme, [key]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div>
        <label htmlFor="dc-primary" className={labelClass}>
          Primary color
        </label>
        <input
          id="dc-primary"
          type="color"
          value={theme.primaryColor}
          onChange={(e) => update("primaryColor", e.target.value)}
          className="h-9 w-full cursor-pointer rounded-lg border border-border bg-white/5"
        />
      </div>
      <div>
        <label htmlFor="dc-secondary" className={labelClass}>
          Secondary color
        </label>
        <input
          id="dc-secondary"
          type="color"
          value={theme.secondaryColor}
          onChange={(e) => update("secondaryColor", e.target.value)}
          className="h-9 w-full cursor-pointer rounded-lg border border-border bg-white/5"
        />
      </div>
      <div>
        <label htmlFor="dc-style" className={labelClass}>
          Style
        </label>
        <select id="dc-style" value={style} onChange={(e) => onStyleChange(e.target.value)} className={selectClass}>
          {STYLE_PRESETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dc-radius" className={labelClass}>
          Border radius
        </label>
        <select
          id="dc-radius"
          value={theme.borderRadius}
          onChange={(e) => update("borderRadius", e.target.value as Theme["borderRadius"])}
          className={selectClass}
        >
          {RADIUS_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dc-button" className={labelClass}>
          Button style
        </label>
        <select
          id="dc-button"
          value={theme.buttonStyle}
          onChange={(e) => update("buttonStyle", e.target.value as Theme["buttonStyle"])}
          className={selectClass}
        >
          {BUTTON_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dc-font" className={labelClass}>
          Typography
        </label>
        <select
          id="dc-font"
          value={theme.fontStyle}
          onChange={(e) => update("fontStyle", e.target.value as Theme["fontStyle"])}
          className={selectClass}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
