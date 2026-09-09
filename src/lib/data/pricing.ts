/**
 * Example starting packages. These are illustrative and meant to be
 * replaced with real pricing before launch — update the values below
 * (a future admin-managed pricing table is a reasonable next step if
 * prices need to change often without a code deploy).
 */

export type PricingTier = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta: string;
};

export const pricingTiers: PricingTier[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "$1,500",
    cadence: "starting at",
    description: "A focused, professional site for businesses getting online.",
    features: [
      "Up to 5 pages",
      "Custom responsive design",
      "Contact form",
      "Basic on-page SEO",
      "2 rounds of revisions",
      "2 weeks estimated timeline",
    ],
    cta: "Start Your Project",
  },
  {
    slug: "professional",
    name: "Professional",
    price: "$3,500",
    cadence: "starting at",
    description: "A complete, conversion-focused site for growing businesses.",
    features: [
      "Up to 12 pages",
      "Custom design system",
      "Blog / content section",
      "Advanced SEO setup",
      "Performance optimization",
      "4 rounds of revisions",
      "3–4 weeks estimated timeline",
      "30 days post-launch support",
    ],
    featured: true,
    cta: "Start Your Project",
  },
  {
    slug: "premium",
    name: "Premium",
    price: "Custom",
    cadence: "quote based on scope",
    description: "E-commerce, custom applications, and complex builds.",
    features: [
      "Unlimited pages / custom scope",
      "E-commerce or custom web application",
      "Third-party integrations",
      "Admin dashboard where needed",
      "Dedicated project management",
      "Priority support",
      "Ongoing maintenance available",
    ],
    cta: "Request a Custom Quote",
  },
];
