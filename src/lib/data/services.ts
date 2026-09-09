import type { LucideIcon } from "lucide-react";
import {
  Palette,
  Code2,
  RefreshCw,
  ShoppingCart,
  Rocket,
  Building2,
  Search,
  Wrench,
  Server,
  Blocks,
} from "lucide-react";

export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  description: string;
  bestFor: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "website-design",
    icon: Palette,
    title: "Website Design",
    shortDescription: "Custom visual design built around your brand.",
    description:
      "A fully custom visual design system for your website — layout, typography, color, and interaction design tailored to your brand rather than pulled from a template.",
    bestFor: "Businesses that want a distinctive look instead of a generic theme.",
    deliverables: [
      "Custom UI design across every page",
      "Responsive layouts for mobile, tablet, desktop",
      "Brand-aligned typography and color system",
      "Interactive prototype for review before development",
    ],
  },
  {
    slug: "website-development",
    icon: Code2,
    title: "Website Development",
    shortDescription: "Fast, modern, production-grade builds.",
    description:
      "Your design brought to life with clean, modern code — built for speed, reliability, and long-term maintainability using a current, well-supported tech stack.",
    bestFor: "Businesses that already have a design or need design + build together.",
    deliverables: [
      "Modern, component-based front-end build",
      "Performance and Core Web Vitals optimization",
      "Cross-browser and cross-device testing",
      "Clean, documented, maintainable code",
    ],
  },
  {
    slug: "website-redesign",
    icon: RefreshCw,
    title: "Website Redesign",
    shortDescription: "Modernize an outdated or underperforming site.",
    description:
      "We audit your current site, identify what's holding it back — design, speed, conversion, mobile experience — and rebuild it into something modern and effective, without losing what already works.",
    bestFor: "Businesses with an existing site that looks dated or underperforms.",
    deliverables: [
      "Full audit of current site and analytics",
      "Modernized design and information architecture",
      "Content and SEO migration plan",
      "Before/after performance comparison",
    ],
  },
  {
    slug: "ecommerce-websites",
    icon: ShoppingCart,
    title: "E-commerce Websites",
    shortDescription: "Online stores built to convert browsers into buyers.",
    description:
      "A complete online store — product catalog, cart, checkout, and payment processing — designed to make purchasing simple and to convert visitors into customers.",
    bestFor: "Businesses selling physical or digital products online.",
    deliverables: [
      "Product catalog and inventory structure",
      "Secure checkout and payment integration",
      "Order and customer management",
      "Conversion-focused product and cart pages",
    ],
  },
  {
    slug: "landing-pages",
    icon: Rocket,
    title: "Landing Pages",
    shortDescription: "High-converting pages for campaigns and launches.",
    description:
      "A focused, single-purpose page engineered around one goal — sign-ups, bookings, sales — with clear messaging, fast load times, and a conversion-first layout.",
    bestFor: "Product launches, ad campaigns, and lead-generation offers.",
    deliverables: [
      "Conversion-focused copy structure",
      "A/B-testable layout sections",
      "Fast load time for paid traffic",
      "Analytics and conversion tracking setup",
    ],
  },
  {
    slug: "business-websites",
    icon: Building2,
    title: "Business Websites",
    shortDescription: "Professional sites that build credibility.",
    description:
      "A polished, professional website that represents your business well — clear service pages, credibility signals, and an easy path for visitors to contact you.",
    bestFor: "Local and professional service businesses establishing an online presence.",
    deliverables: [
      "Home, services, about, and contact pages",
      "Credibility elements — testimonials, credentials",
      "Local SEO fundamentals",
      "Mobile-first responsive design",
    ],
  },
  {
    slug: "seo-optimization",
    icon: Search,
    title: "SEO Optimization",
    shortDescription: "Technical and on-page SEO foundations.",
    description:
      "Technical and on-page SEO built into your site's foundation — structured metadata, semantic HTML, sitemaps, and performance optimization that search engines reward.",
    bestFor: "Businesses that want to be found organically on search engines.",
    deliverables: [
      "Technical SEO audit and fixes",
      "On-page metadata and heading structure",
      "Sitemap, robots.txt, and structured data",
      "Core Web Vitals performance tuning",
    ],
  },
  {
    slug: "website-maintenance",
    icon: Wrench,
    title: "Website Maintenance",
    shortDescription: "Ongoing updates, monitoring, and support.",
    description:
      "Ongoing care for your website after launch — updates, monitoring, backups, and support — so it stays secure, fast, and current without you having to manage it yourself.",
    bestFor: "Businesses that want their site handled after launch, not abandoned.",
    deliverables: [
      "Regular updates and dependency monitoring",
      "Uptime and performance monitoring",
      "Content updates and minor changes",
      "Priority support for issues",
    ],
  },
  {
    slug: "hosting-deployment",
    icon: Server,
    title: "Hosting & Deployment",
    shortDescription: "Reliable, modern infrastructure setup.",
    description:
      "Production deployment on modern, reliable infrastructure with proper environment configuration, continuous deployment from your source repository, and monitoring in place.",
    bestFor: "Businesses that want a hassle-free, reliable technical setup.",
    deliverables: [
      "Production hosting and domain configuration",
      "Continuous deployment pipeline",
      "SSL, environment variables, and security basics",
      "Staging and production environments",
    ],
  },
  {
    slug: "custom-web-applications",
    icon: Blocks,
    title: "Custom Web Applications",
    shortDescription: "Bespoke tools beyond a marketing website.",
    description:
      "Beyond a marketing site — custom portals, dashboards, booking systems, or internal tools built around your specific business logic and workflows.",
    bestFor: "Businesses that need functionality a template or plugin can't provide.",
    deliverables: [
      "Custom data model and application logic",
      "User accounts and role-based access where needed",
      "Third-party integrations (payments, email, APIs)",
      "Admin tooling for ongoing management",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
