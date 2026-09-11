"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Theme } from "@/lib/validations/concept";
import { fontFamilyFor, headingWeightFor, buttonStyle } from "@/components/visualizer/preview/theme-context";
import { scrollToSection, type NavLink } from "@/components/visualizer/preview/section-nav";

export function PreviewNav({
  businessName,
  theme,
  navLinks,
  homeId,
}: {
  businessName: string;
  theme: Theme;
  navLinks: NavLink[];
  homeId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const contactLink = navLinks.find((l) => l.label.toLowerCase().includes("contact"));

  return (
    <header className="relative" style={{ borderBottom: `1px solid ${theme.textColor}14` }}>
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={() => scrollToSection(homeId)}
          className="text-base sm:text-lg"
          style={{ fontFamily: fontFamilyFor(theme), fontWeight: headingWeightFor(theme), color: theme.textColor }}
        >
          {businessName}
        </button>
        <nav className="hidden items-center gap-6 text-sm sm:flex" style={{ color: theme.textColor }}>
          {navLinks
            .filter((l) => l !== contactLink)
            .map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </button>
            ))}
          {contactLink ? (
            <button
              type="button"
              onClick={() => scrollToSection(contactLink.id)}
              className="px-4 py-2 text-xs font-medium"
              style={buttonStyle(theme, "primary")}
            >
              {contactLink.label}
            </button>
          ) : null}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="sm:hidden"
        >
          {open ? (
            <X className="h-5 w-5" style={{ color: theme.textColor }} aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" style={{ color: theme.textColor }} aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <nav
          className="flex flex-col gap-1 px-6 pb-4 sm:hidden"
          style={{ color: theme.textColor }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                scrollToSection(link.id);
                setOpen(false);
              }}
              className="rounded-lg px-2 py-2.5 text-left text-sm opacity-80 hover:opacity-100"
            >
              {link.label}
            </button>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
