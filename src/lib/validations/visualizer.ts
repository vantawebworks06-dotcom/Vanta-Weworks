import { z } from "zod";
import { websiteConceptSchema } from "@/lib/validations/concept";

export const visualizeRequestSchema = z.object({
  businessName: z.string().trim().min(1, "Enter your business name").max(100),
  description: z
    .string()
    .trim()
    .min(15, "Describe your business or website idea in a bit more detail")
    .max(600, "Please keep your description under 600 characters"),
  industry: z.string().trim().max(80).optional().or(z.literal("")),
  style: z.string().trim().max(120).optional().or(z.literal("")),
  colors: z.string().trim().max(120).optional().or(z.literal("")),
  features: z.string().trim().max(200).optional().or(z.literal("")),
});

export type VisualizeRequestValues = z.infer<typeof visualizeRequestSchema>;

export const editConceptSchema = z.object({
  requestId: z.string().uuid(),
  instruction: z.string().trim().min(3, "Describe what you'd like to change").max(300),
  // Validated against the full concept schema, both to bound the payload
  // (no arbitrarily large/malformed blobs reaching the AI call) and because
  // undo/redo is client-side state — the server can't assume its own
  // last-saved config matches what the visitor is currently looking at.
  currentConcept: websiteConceptSchema,
});

export type EditConceptValues = z.infer<typeof editConceptSchema>;

export const leadCaptureSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  business: z.string().trim().max(150).optional().or(z.literal("")),
  projectDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(60).optional().or(z.literal("")),
  visualizationRequestId: z.string().uuid().optional(),
  // Honeypot.
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
});

export type LeadCaptureValues = z.infer<typeof leadCaptureSchema>;

export type VisualizerPreset = {
  label: string;
  businessName: string;
  description: string;
  industry: string;
  style: string;
  colors: string;
  features: string;
};

export const visualizerPresets: VisualizerPreset[] = [
  {
    label: "Luxury restaurant",
    businessName: "Golden Palm",
    description:
      "I own a luxury Jamaican restaurant. I want a dark elegant website with large food photography, online reservations, and a gold accent.",
    industry: "Restaurant / Hospitality",
    style: "Dark, elegant, upscale",
    colors: "Black with gold accents",
    features: "Online reservations, photo gallery, menu, testimonials",
  },
  {
    label: "Modern construction company",
    businessName: "Ironline Construction",
    description:
      "A modern construction company that needs to showcase completed projects and make it easy for clients to request a quote.",
    industry: "Construction",
    style: "Bold, industrial, modern",
    colors: "Charcoal with safety-orange accents",
    features: "Project gallery, quote request, service areas",
  },
  {
    label: "Professional law firm",
    businessName: "Harbor & Wells Law",
    description:
      "A professional law firm that wants to build trust with prospective clients and highlight practice areas and attorney profiles.",
    industry: "Legal Services",
    style: "Professional, trustworthy, refined",
    colors: "Navy blue and white",
    features: "Practice areas, attorney bios, consultation booking",
  },
  {
    label: "Minimalist clothing brand",
    businessName: "Studio Nine",
    description:
      "A minimalist clothing brand focused on a clean online shopping experience with large product photography.",
    industry: "E-commerce / Fashion",
    style: "Minimalist, clean, editorial",
    colors: "Black, white, and beige",
    features: "Product showcase, lookbook, newsletter signup",
  },
  {
    label: "Premium real estate company",
    businessName: "Meridian Properties",
    description:
      "A premium real estate company that wants an elegant property showcase with high-quality imagery and an inquiry form.",
    industry: "Real Estate",
    style: "Premium, sophisticated, spacious",
    colors: "Deep green with cream accents",
    features: "Property showcase, agent profiles, inquiry form",
  },
];
