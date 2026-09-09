import type { Theme } from "@/lib/validations/concept";
import { fontFamilyFor, headingWeightFor } from "@/components/visualizer/preview/theme-context";

export function PreviewFooter({ businessName, theme }: { businessName: string; theme: Theme }) {
  return (
    <footer
      className="px-6 py-8 text-center sm:px-10"
      style={{ borderTop: `1px solid ${theme.textColor}14`, color: theme.textColor }}
    >
      <p className="text-sm" style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme) }}>
        {businessName}
      </p>
      <p className="mt-1 text-xs opacity-50">&copy; {new Date().getFullYear()} — Concept preview</p>
    </footer>
  );
}
