import "server-only";
import {
  OPENAI_API_BASE,
  withTimeout,
  getOpenAiKey,
  AiProviderError,
  AiValidationError,
} from "@/lib/ai/errors";
import {
  websiteConceptSchema,
  ensureSectionIds,
  type WebsiteConcept,
} from "@/lib/validations/concept";

const MODEL = "gpt-4o-mini";

const SCHEMA_GUIDE = `
You design website concepts for a web design agency's "AI Website Visualizer" tool.
Given a description of a business, respond with ONLY a JSON object (no prose, no markdown
fences) matching exactly this shape:

{
  "businessName": string,
  "style": string,               // short label, e.g. "luxury", "minimal", "playful", "corporate"
  "theme": {
    "primaryColor": "#rrggbb",
    "secondaryColor": "#rrggbb",
    "backgroundColor": "#rrggbb",
    "textColor": "#rrggbb",
    "borderRadius": "none" | "sm" | "md" | "lg" | "full",
    "buttonStyle": "solid" | "outline" | "gradient" | "pill",
    "fontStyle": "modern" | "classic" | "elegant" | "minimal" | "bold"
  },
  "sections": [ 3 to 7 of the following, always starting with exactly one "hero" ]
}

Section shapes (every section needs a short unique "id" string):
- hero: { "id", "type":"hero", "variant":"luxury"|"minimal"|"bold"|"split", "heading", "subheading"?, "description", "primaryCta", "secondaryCta"?, "imagePrompt"? }
- services/features: { "id", "type":"services"|"features", "variant":"cards"|"list"|"grid", "heading"?, "description"?, "items":[{ "title","description","icon"? }] (1-8 items) }
- about: { "id", "type":"about", "heading", "description" }
- testimonials: { "id", "type":"testimonials", "variant":"cards"|"carousel", "heading"?, "items":[{ "name","role"?,"quote","rating"? }] (1-6 items) }
- gallery: { "id", "type":"gallery", "variant":"grid"|"masonry", "heading"?, "imageCount" (1-9) }
- cta: { "id", "type":"cta", "heading", "description"?, "buttonLabel" }
- contact: { "id", "type":"contact", "heading"?, "description"?, "showForm", "whatsapp" }

Colors must be real hex codes forming a coherent, accessible palette matching the requested
style (backgroundColor and textColor must contrast well). Write genuinely good marketing copy
for every heading/description/CTA — specific to the business described, never generic
placeholder text like "Lorem ipsum" or "Your Heading Here". "icon" fields, if included, must
be one of: sparkles, star, heart, shield, rocket, leaf, gem, clock, phone, mail, mapPin,
utensils, hammer, briefcase, home, camera, palette, scale, shoppingBag, dumbbell.
`.trim();

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new AiValidationError("The AI response was not valid JSON.");
  }
}

async function callChatJson(messages: { role: "system" | "user"; content: string }[]): Promise<unknown> {
  const apiKey = getOpenAiKey();

  const response = await withTimeout((signal) =>
    fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
      signal,
    })
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new AiProviderError(`Concept generation failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiProviderError("Concept generation returned an unexpected response shape.");
  }

  return extractJson(content);
}

function validate(raw: unknown): WebsiteConcept {
  const parsed = websiteConceptSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AiValidationError(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }
  return ensureSectionIds(parsed.data);
}

export type ConceptInput = {
  businessName: string;
  description: string;
  industry?: string;
  style?: string;
  colors?: string;
  features?: string;
};

function buildUserPrompt(input: ConceptInput): string {
  return [
    `Business name: ${input.businessName}`,
    `Description: ${input.description}`,
    input.industry ? `Industry: ${input.industry}` : null,
    input.style ? `Desired style: ${input.style}` : null,
    input.colors ? `Preferred colors: ${input.colors}` : null,
    input.features ? `Important features: ${input.features}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Generates a brand-new website concept from the visitor's description. */
export async function generateWebsiteConcept(input: ConceptInput): Promise<WebsiteConcept> {
  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: SCHEMA_GUIDE },
    { role: "user", content: buildUserPrompt(input) },
  ];

  try {
    return validate(await callChatJson(messages));
  } catch (err) {
    if (!(err instanceof AiValidationError)) throw err;
    // One retry, telling the model exactly what was wrong with its first attempt.
    messages.push(
      { role: "user", content: "That response did not match the required shape." },
      { role: "user", content: `Validation errors: ${err.message}. Return corrected JSON only.` }
    );
    return validate(await callChatJson(messages));
  }
}

/**
 * Applies a natural-language edit to an existing concept. Asks the model to
 * return the complete updated concept (simpler and more reliable than a
 * partial JSON patch), instructed to change only what the request implies
 * and preserve everything else.
 */
export async function editWebsiteConcept(
  current: WebsiteConcept,
  instruction: string
): Promise<WebsiteConcept> {
  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: SCHEMA_GUIDE },
    {
      role: "user",
      content: [
        "Here is the CURRENT website concept as JSON:",
        JSON.stringify(current),
        "",
        `The user requested this change: "${instruction}"`,
        "",
        "Return the COMPLETE updated concept JSON in the same shape. Change only what the",
        "request implies; keep every other field, section, and piece of copy exactly as-is.",
        "Keep existing section \"id\" values unchanged unless a section is added or removed.",
      ].join("\n"),
    },
  ];

  try {
    return validate(await callChatJson(messages));
  } catch (err) {
    if (!(err instanceof AiValidationError)) throw err;
    messages.push(
      { role: "user", content: "That response did not match the required shape." },
      { role: "user", content: `Validation errors: ${err.message}. Return corrected JSON only.` }
    );
    return validate(await callChatJson(messages));
  }
}
