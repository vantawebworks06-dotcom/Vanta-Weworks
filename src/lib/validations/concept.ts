import { z } from "zod";

/**
 * Structured website concept schema. The AI only ever produces data matching
 * this shape — never markup, CSS, or executable code — which is then
 * rendered by our own trusted React components in
 * src/components/visualizer/preview/. This is what keeps the live preview
 * safe: there is no code path where AI output is interpreted as code.
 */

export const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]),
  buttonStyle: z.enum(["solid", "outline", "gradient", "pill"]),
  fontStyle: z.enum(["modern", "classic", "elegant", "minimal", "bold"]),
});

export type Theme = z.infer<typeof themeSchema>;

const sectionBase = {
  id: z.string().min(1).max(40),
};

export const heroSectionSchema = z.object({
  ...sectionBase,
  type: z.literal("hero"),
  variant: z.enum(["luxury", "minimal", "bold", "split"]),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(160).optional(),
  description: z.string().min(1).max(400),
  primaryCta: z.string().min(1).max(40),
  secondaryCta: z.string().max(40).optional(),
  imagePrompt: z.string().max(300).optional(),
  imageUrl: z.string().url().optional(),
});

export const featureItemSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(240),
  icon: z.string().max(40).optional(),
});

export const servicesSectionSchema = z.object({
  ...sectionBase,
  type: z.enum(["services", "features"]),
  variant: z.enum(["cards", "list", "grid"]),
  heading: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  items: z.array(featureItemSchema).min(1).max(8),
});

export const aboutSectionSchema = z.object({
  ...sectionBase,
  type: z.literal("about"),
  heading: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
});

export const testimonialItemSchema = z.object({
  name: z.string().min(1).max(80),
  role: z.string().max(100).optional(),
  quote: z.string().min(1).max(400),
  // Coerce rather than hard-reject an imperfect rating (e.g. an AI response
  // of 4.5, or "5" as a string) — the model's intent is clear even when the
  // exact type/value isn't, so normalize instead of failing the whole
  // generation.
  rating: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((n) => (typeof n === "number" && !Number.isNaN(n) ? Math.min(5, Math.max(1, Math.round(n))) : undefined)),
});

export const testimonialsSectionSchema = z.object({
  ...sectionBase,
  type: z.literal("testimonials"),
  variant: z.enum(["cards", "carousel"]),
  heading: z.string().max(120).optional(),
  items: z.array(testimonialItemSchema).min(1).max(6),
});

export const gallerySectionSchema = z.object({
  ...sectionBase,
  type: z.literal("gallery"),
  variant: z.enum(["grid", "masonry"]),
  heading: z.string().max(120).optional(),
  imageCount: z.number().int().min(1).max(9).default(6),
});

export const ctaSectionSchema = z.object({
  ...sectionBase,
  type: z.literal("cta"),
  heading: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  buttonLabel: z.string().min(1).max(40),
});

export const contactSectionSchema = z.object({
  ...sectionBase,
  type: z.literal("contact"),
  heading: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  showForm: z.boolean().default(true),
  whatsapp: z.boolean().default(false),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  servicesSectionSchema,
  aboutSectionSchema,
  testimonialsSectionSchema,
  gallerySectionSchema,
  ctaSectionSchema,
  contactSectionSchema,
]);

export type Section = z.infer<typeof sectionSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type ServicesSection = z.infer<typeof servicesSectionSchema>;
export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
export type GallerySection = z.infer<typeof gallerySectionSchema>;
export type CtaSection = z.infer<typeof ctaSectionSchema>;
export type ContactSection = z.infer<typeof contactSectionSchema>;

export const websiteConceptSchema = z.object({
  businessName: z.string().min(1).max(100),
  style: z.string().min(1).max(60),
  theme: themeSchema,
  sections: z.array(sectionSchema).min(2).max(9),
});

export type WebsiteConcept = z.infer<typeof websiteConceptSchema>;

/** Ensures every section has a unique, non-empty id (assigns one if missing/duplicate). */
export function ensureSectionIds(concept: WebsiteConcept): WebsiteConcept {
  const seen = new Set<string>();
  return {
    ...concept,
    sections: concept.sections.map((section, i) => {
      let id = section.id && section.id.trim() ? section.id : `${section.type}-${i}`;
      while (seen.has(id)) id = `${id}-${i}`;
      seen.add(id);
      return { ...section, id };
    }),
  };
}
