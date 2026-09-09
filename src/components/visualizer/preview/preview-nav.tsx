import { Menu } from "lucide-react";
import type { Theme } from "@/lib/validations/concept";
import { fontFamilyFor, headingWeightFor, buttonStyle } from "@/components/visualizer/preview/theme-context";

export function PreviewNav({ businessName, theme }: { businessName: string; theme: Theme }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 sm:px-10"
      style={{ borderBottom: `1px solid ${theme.textColor}14` }}
    >
      <span
        className="text-base sm:text-lg"
        style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
      >
        {businessName}
      </span>
      <nav className="hidden items-center gap-6 text-sm sm:flex" style={{ color: theme.textColor }}>
        <span className="opacity-70">Home</span>
        <span className="opacity-70">About</span>
        <span className="opacity-70">Services</span>
        <button type="button" className="px-4 py-2 text-xs font-medium" style={buttonStyle(theme, "primary")}>
          Contact
        </button>
      </nav>
      <Menu className="h-5 w-5 sm:hidden" style={{ color: theme.textColor }} aria-hidden="true" />
    </header>
  );
}
