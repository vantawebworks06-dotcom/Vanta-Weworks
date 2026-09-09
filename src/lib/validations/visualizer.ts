import { z } from "zod";

export const visualizeRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(15, "Describe your business or website idea in a bit more detail")
    .max(600, "Please keep your description under 600 characters"),
  industry: z.string().trim().max(80).optional().or(z.literal("")),
  style: z.string().trim().max(120).optional().or(z.literal("")),
  colors: z.string().trim().max(120).optional().or(z.literal("")),
  targetAudience: z.string().trim().max(120).optional().or(z.literal("")),
  features: z.string().trim().max(200).optional().or(z.literal("")),
});

export type VisualizeRequestValues = z.infer<typeof visualizeRequestSchema>;

export const leadCaptureSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  business: z.string().trim().max(150).optional().or(z.literal("")),
  projectDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  visualizationRequestId: z.string().uuid().optional(),
  // Honeypot.
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
});

export type LeadCaptureValues = z.infer<typeof leadCaptureSchema>;

export type VisualizerPreset = {
  label: string;
  description: string;
  industry: string;
  style: string;
  colors: string;
};

export const visualizerPresets: VisualizerPreset[] = [
  {
    label: "Luxury restaurant",
    description:
      "A luxury restaurant with a dark, elegant atmosphere, large food photography, and online table reservations.",
    industry: "Restaurant / Hospitality",
    style: "Dark, elegant, upscale",
    colors: "Black with gold accents",
  },
  {
    label: "Modern construction company",
    description:
      "A modern construction company that needs to showcase completed projects and make it easy for clients to request a quote.",
    industry: "Construction",
    style: "Bold, industrial, modern",
    colors: "Charcoal with safety-orange accents",
  },
  {
    label: "Professional law firm",
    description:
      "A professional law firm that wants to build trust with prospective clients and highlight practice areas and attorney profiles.",
    industry: "Legal Services",
    style: "Professional, trustworthy, refined",
    colors: "Navy blue and white",
  },
  {
    label: "Minimalist clothing brand",
    description:
      "A minimalist clothing brand focused on a clean online shopping experience with large product photography.",
    industry: "E-commerce / Fashion",
    style: "Minimalist, clean, editorial",
    colors: "Black, white, and beige",
  },
  {
    label: "Premium real estate company",
    description:
      "A premium real estate company that wants an elegant property showcase with high-quality imagery and an inquiry form.",
    industry: "Real Estate",
    style: "Premium, sophisticated, spacious",
    colors: "Deep green with cream accents",
  },
];
