import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(2).max(150),
  summary: z.string().trim().max(400).optional().or(z.literal("")),
  content: z.string().trim().max(4000).optional().or(z.literal("")),
  client_name: z.string().trim().max(150).optional().or(z.literal("")),
  industry: z.string().trim().max(100).optional().or(z.literal("")),
  services_provided: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  results: z.string().trim().max(400).optional().or(z.literal("")),
  project_url: z.string().trim().max(300).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.coerce.boolean().default(true),
  is_placeholder: z.coerce.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const testimonialSchema = z.object({
  client_name: z.string().trim().min(2).max(150),
  client_title: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  quote: z.string().trim().min(10).max(1000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.coerce.boolean().default(true),
  is_placeholder: z.coerce.boolean().default(false),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.coerce.boolean().default(true),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
