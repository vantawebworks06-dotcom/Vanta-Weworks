/**
 * Central site configuration. Anything here that varies by deployment
 * (real contact details, social profiles) is sourced from environment
 * variables so it never needs a code change to update — and so this
 * repo never ships fabricated business information.
 *
 * Unset values render as `null` and calling components are expected to
 * hide the corresponding UI rather than show a placeholder.
 */

const env = (key: string): string | null => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
};

export const siteConfig = {
  name: "Vanta Webworks",
  shortName: "Vanta",
  tagline: "Websites Built to Make Your Business Stand Out.",
  description:
    "Vanta Webworks designs and develops modern, high-performing websites for businesses — from landing pages to full custom web applications.",
  url: env("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",

  contact: {
    email: env("NEXT_PUBLIC_CONTACT_EMAIL"),
    phone: env("NEXT_PUBLIC_CONTACT_PHONE"),
    whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER"),
    address: env("NEXT_PUBLIC_BUSINESS_ADDRESS"),
    serviceArea: env("NEXT_PUBLIC_SERVICE_AREA"),
  },

  social: {
    twitter: env("NEXT_PUBLIC_SOCIAL_TWITTER"),
    instagram: env("NEXT_PUBLIC_SOCIAL_INSTAGRAM"),
    linkedin: env("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
    github: env("NEXT_PUBLIC_SOCIAL_GITHUB"),
    facebook: env("NEXT_PUBLIC_SOCIAL_FACEBOOK"),
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "AI Visualizer", href: "/visualizer" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
