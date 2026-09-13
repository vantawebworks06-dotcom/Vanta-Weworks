/**
 * Real starting packages. Structured so prices and features can easily be
 * changed later (a future admin-managed pricing table is a reasonable next
 * step if prices need to change often without a code deploy).
 *
 * Vanta Launch Savings: temporary promotional pricing. `originalPrice` and
 * `savings` back the strikethrough/"Save $X" presentation in the pricing
 * cards — update all three fields together if pricing ever changes.
 */

export type PricingTier = {
  slug: string;
  name: string;
  price: string;
  originalPrice: string;
  savings: string;
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
    price: "$450",
    originalPrice: "$600",
    savings: "Save $150",
    cadence: "USD",
    description: "Get your business online with a professional, modern website.",
    features: [
      "Up to 4 pages",
      "Custom website design",
      "Mobile responsive design",
      "Contact & WhatsApp integration",
      "Basic SEO setup",
      "Google Maps integration",
      "2 revisions",
    ],
    maintenance: "14 days of post-launch support",
    cta: "Start Your Project",
  },
  {
    slug: "professional",
    name: "Professional",
    price: "$850",
    originalPrice: "$1,050",
    savings: "Save $200",
    cadence: "USD",
    description:
      "Turn visitors into customers with a professional website built around your business.",
    features: [
      "Up to 8 pages",
      "Custom website design",
      "Mobile responsive design",
      "Contact & WhatsApp integration",
      "Basic SEO setup",
      "Google Maps integration",
      "Advanced contact forms",
      "Google Analytics integration",
      "3 revisions",
    ],
    maintenance: "30 days of post-launch support",
    featured: true,
    cta: "Start Your Project",
  },
  {
    slug: "custom",
    name: "Custom",
    price: "$1,500",
    originalPrice: "$1,700",
    savings: "Save $200",
    cadence: "USD",
    description:
      "Build something bigger with custom functionality designed around your business.",
    features: [
      "Custom number of pages",
      "Fully custom design",
      "Mobile responsive design",
      "Advanced functionality",
      "E-commerce capabilities",
      "Online booking systems",
      "Customer accounts",
      "Custom integrations",
      "4 revisions",
    ],
    maintenance: "60 days of post-launch support",
    cta: "Request a Custom Quote",
  },
];
