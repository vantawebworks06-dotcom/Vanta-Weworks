/**
 * Real starting packages. Structured so prices and features can easily be
 * changed later (a future admin-managed pricing table is a reasonable next
 * step if prices need to change often without a code deploy).
 */

export type PricingTier = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  maintenance: string;
  featured?: boolean;
  cta: string;
};

export const pricingTiers: PricingTier[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "$650–$750",
    cadence: "USD",
    description: "Best for businesses looking for a professional online presence.",
    features: [
      "1–4 pages",
      "Mobile-responsive design",
      "Custom website design",
      "Contact/WhatsApp integration",
      "Google Maps integration",
      "Contact forms",
      "Basic animations/interactions",
      "Basic speed optimization",
      "1–2 revisions",
    ],
    maintenance: "Optional",
    cta: "Start Your Project",
  },
  {
    slug: "professional",
    name: "Professional",
    price: "$1,200–$1,500",
    cadence: "USD",
    description: "Recommended for businesses looking for a more complete and advanced website.",
    features: [
      "Everything in Starter, plus:",
      "5–8 pages",
      "Basic SEO",
      "Google Business optimization",
      "Advanced animations/interactions",
      "Booking system",
      "Blog/news section",
      "Analytics",
      "Improved speed optimization",
      "3–5 revisions",
      "Online payments available as an optional feature",
    ],
    maintenance: "Optional",
    featured: true,
    cta: "Start Your Project",
  },
  {
    slug: "custom",
    name: "Custom",
    price: "$3,000+",
    cadence: "USD",
    description: "For businesses that want a complete, high-end website with advanced functionality.",
    features: [
      "8+ pages",
      "Fully custom design",
      "Mobile-responsive",
      "WhatsApp/contact integration",
      "Google Maps",
      "Contact forms",
      "Advanced SEO",
      "Google Business optimization",
      "Premium animations/interactions",
      "Booking system",
      "Online payments",
      "Blog/news section",
      "Analytics",
      "Advanced speed optimization",
      "Unlimited revisions during development",
    ],
    maintenance: "1–3 months included",
    cta: "Request a Custom Quote",
  },
];
