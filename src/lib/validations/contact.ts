import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  websiteUrl: z.string().trim().max(300).optional().or(z.literal("")),
  serviceInterested: z.string().trim().max(100).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(60).optional().or(z.literal("")),
  preferredTimeline: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more about your project (at least 20 characters)")
    .max(4000),
  // Honeypot field: real users never fill this in. Bots that auto-fill every
  // input will, letting us silently drop the submission server-side.
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const budgetRanges = [
  "Under $1,500",
  "$1,500 – $3,500",
  "$3,500 – $7,500",
  "$7,500+",
  "Not sure yet",
] as const;

export const timelineOptions = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "Just exploring options",
] as const;
