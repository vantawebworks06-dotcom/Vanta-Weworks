/**
 * Structured demo data for the homepage hero's rotating "live website
 * preview" (see src/components/sections/home/hero-website-demo.tsx). Each
 * entry describes one miniature website — business, theme, nav, hero copy,
 * and a content section — rendered by a small set of shared layout
 * components rather than one-off JSX per business, so this is the same
 * shape a future connection to the real AI Visualizer output could target.
 */

export type HeroDemoCard = {
  title: string;
  meta?: string;
  price?: string;
  cta: string;
  image: string;
};

export type HeroDemoLayout = "listing-grid" | "service-grid" | "showcase-grid";

export type HeroDemoTheme = {
  primary: string;
  secondary: string;
  surface: string;
  text: string;
  font: "sans" | "serif";
};

export type HeroDemoConfig = {
  slug: string;
  businessName: string;
  businessType: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  heroImage: string;
  nav: string[];
  theme: HeroDemoTheme;
  layout: HeroDemoLayout;
  sectionHeading: string;
  /** Decorative only (e.g. real estate's "For Sale / For Rent" filters) — not wired to real filtering. */
  filters?: string[];
  cards: HeroDemoCard[];
};

export const heroDemoConfigs: HeroDemoConfig[] = [
  {
    slug: "car-rental",
    businessName: "IslandDrive Rentals",
    businessType: "Car Rental",
    headline: "Explore Jamaica Your Way",
    subheadline: "Reliable vehicles for every journey.",
    primaryCta: "Book Your Ride",
    heroImage: "/homepage-demo/car-rental/hero.jpg",
    nav: ["Home", "Vehicles", "About", "Contact"],
    theme: { primary: "#0d9488", secondary: "#fbbf24", surface: "#ffffff", text: "#0f172a", font: "sans" },
    layout: "listing-grid",
    sectionHeading: "Featured Vehicles",
    cards: [
      { title: "Toyota Corolla", meta: "Automatic · 5 seats · A/C", price: "From $45/day", cta: "Book Now", image: "/homepage-demo/car-rental/card1.jpg" },
      { title: "Toyota RAV4", meta: "Automatic · 5 seats · SUV", price: "From $65/day", cta: "Book Now", image: "/homepage-demo/car-rental/card2.jpg" },
      { title: "Honda CR-V", meta: "Automatic · 5 seats · SUV", price: "From $70/day", cta: "Book Now", image: "/homepage-demo/car-rental/card3.jpg" },
    ],
  },
  {
    slug: "pizza",
    businessName: "Kingston Pizza",
    businessType: "Pizza Restaurant",
    headline: "Fresh Pizza. Made Your Way.",
    subheadline: "Hand-tossed daily, delivered hot.",
    primaryCta: "Order Now",
    heroImage: "/homepage-demo/pizza/hero.jpg",
    nav: ["Home", "Menu", "About", "Delivery"],
    theme: { primary: "#dc2626", secondary: "#f59e0b", surface: "#fffaf3", text: "#1c1006", font: "sans" },
    layout: "listing-grid",
    sectionHeading: "Popular Pizzas",
    cards: [
      { title: "Margherita", meta: "Tomato · mozzarella · basil", price: "$12", cta: "Order Now", image: "/homepage-demo/pizza/card1.jpg" },
      { title: "Pepperoni", meta: "Spicy pepperoni · mozzarella", price: "$14", cta: "Order Now", image: "/homepage-demo/pizza/card2.jpg" },
      { title: "Quattro Formaggi", meta: "Four-cheese blend", price: "$15", cta: "Order Now", image: "/homepage-demo/pizza/card3.jpg" },
    ],
  },
  {
    slug: "real-estate",
    businessName: "Kingston Properties",
    businessType: "Real Estate",
    headline: "Find a Place You'll Love to Call Home.",
    subheadline: "Curated listings across Kingston's best neighborhoods.",
    primaryCta: "View Listings",
    heroImage: "/homepage-demo/real-estate/hero.jpg",
    nav: ["Home", "Properties", "Agents", "Contact"],
    theme: { primary: "#1e3a5f", secondary: "#c9a15a", surface: "#ffffff", text: "#1a1a1a", font: "serif" },
    layout: "listing-grid",
    sectionHeading: "Featured Properties",
    filters: ["For Sale", "For Rent", "New Listings"],
    cards: [
      { title: "Cooper Hill Residence", meta: "4 bed · 3 bath · 3,200 sqft", price: "$850,000", cta: "View Property", image: "/homepage-demo/real-estate/card1.jpg" },
      { title: "Harbour View Villa", meta: "5 bed · 4 bath · Pool", price: "$1,250,000", cta: "View Property", image: "/homepage-demo/real-estate/card2.jpg" },
      { title: "Uptown Modern Loft", meta: "2 bed · 2 bath · City view", price: "$420,000", cta: "View Property", image: "/homepage-demo/real-estate/card3.jpg" },
    ],
  },
  {
    slug: "barber",
    businessName: "FreshCut Kingston",
    businessType: "Barber Shop",
    headline: "Sharp Cuts. Clean Style.",
    subheadline: "Precision barbering, walk-ins welcome.",
    primaryCta: "Book Appointment",
    heroImage: "/homepage-demo/barber/hero.jpg",
    nav: ["Home", "Services", "Gallery", "Book"],
    theme: { primary: "#c9a15a", secondary: "#e5e5e5", surface: "#141414", text: "#f5f5f5", font: "sans" },
    layout: "service-grid",
    sectionHeading: "Our Services",
    cards: [
      { title: "Signature Fade", meta: "Skin fade with clipper precision", price: "$35", cta: "Book Now", image: "/homepage-demo/barber/card1.jpg" },
      { title: "Classic Cut & Shave", meta: "Scissor cut with hot towel finish", price: "$40", cta: "Book Now", image: "/homepage-demo/barber/card2.jpg" },
      { title: "Style & Finish", meta: "Wash, cut, and blow-dry styling", price: "$28", cta: "Book Now", image: "/homepage-demo/barber/card3.jpg" },
    ],
  },
  {
    slug: "construction",
    businessName: "BuildRight Construction",
    businessType: "Construction Company",
    headline: "Building With Strength. Delivering With Confidence.",
    subheadline: "Residential & commercial construction done right.",
    primaryCta: "Request a Quote",
    heroImage: "/homepage-demo/construction/hero.jpg",
    nav: ["Home", "Services", "Projects", "Contact"],
    theme: { primary: "#f97316", secondary: "#1e293b", surface: "#f8fafc", text: "#0f172a", font: "sans" },
    layout: "showcase-grid",
    sectionHeading: "What We Do",
    cards: [
      { title: "Excavation & Sitework", meta: "Heavy equipment for site prep and grading", cta: "Request a Quote", image: "/homepage-demo/construction/card1.jpg" },
      { title: "Commercial & Highrise", meta: "Full-scale commercial construction management", cta: "Request a Quote", image: "/homepage-demo/construction/card2.jpg" },
      { title: "Residential Construction", meta: "Custom home builds from the ground up", cta: "Request a Quote", image: "/homepage-demo/construction/card3.jpg" },
    ],
  },
];
