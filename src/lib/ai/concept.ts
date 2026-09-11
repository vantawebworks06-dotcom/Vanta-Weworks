import "server-only";
import {
  GROQ_API_BASE,
  withTimeout,
  getGroqApiKey,
  parseRetryAfterMs,
  sleep,
  AiProviderError,
  AiRateLimitError,
  AiValidationError,
} from "@/lib/ai/errors";
import {
  websiteConceptSchema,
  ensureSectionIds,
  type WebsiteConcept,
} from "@/lib/validations/concept";

// Groq-hosted gpt-oss-20b — free tier, OpenAI-compatible chat completions
// API. Chosen over Groq's larger models after testing: it reliably returns
// well-formed nested JSON for this schema, while gpt-oss-120b occasionally
// mangled deeply-nested sections and Qwen's free-tier output-token-per-minute
// limit is too low for a response this size. See console.groq.com.
const MODEL = "openai/gpt-oss-20b";

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
- testimonials: { "id", "type":"testimonials", "variant":"cards"|"carousel", "heading"?, "items":[{ "name","role"?,"quote","rating"? }] (1-6 items; "rating" is a whole number 1-5) }
- gallery: { "id", "type":"gallery", "variant":"grid"|"masonry", "heading"?, "imageCount" (1-9) }
- cta: { "id", "type":"cta", "heading", "description"?, "buttonLabel" }
- contact: { "id", "type":"contact", "heading"?, "description"?, "showForm", "whatsapp" }

Colors must be real hex codes forming a coherent, accessible palette matching the requested
style (backgroundColor and textColor must contrast well). Write genuinely good marketing copy
for every heading/description/CTA — specific to the business described, never generic
placeholder text like "Lorem ipsum" or "Your Heading Here". "icon" fields, if included, must
be one of: sparkles, star, heart, shield, rocket, leaf, gem, clock, phone, mail, mapPin,
utensils, hammer, briefcase, home, camera, palette, scale, shoppingBag, dumbbell.

Respond with the JSON object only — no other text before or after it.
`.trim();

function extractJson(raw: string): unknown {
  // Models occasionally wrap JSON in markdown fences despite instructions
  // not to; strip those before parsing rather than failing outright.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AiValidationError("The AI response was not valid JSON.");
  }
}

async function callChatJson(messages: { role: "system" | "user"; content: string }[]): Promise<unknown> {
  const apiKey = getGroqApiKey();

  const response = await withTimeout((signal) =>
    fetch(`${GROQ_API_BASE}/chat/completions`, {
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
        // Low reasoning effort: this is a well-specified structured-output
        // task, not a multi-step reasoning problem — cutting reasoning
        // tokens keeps responses fast and well within the free tier's
        // tokens-per-minute budget, without hurting output quality here.
        reasoning_effort: "low",
      }),
      signal,
    })
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new AiRateLimitError(
        `Concept generation was rate-limited: ${body.slice(0, 300)}`,
        parseRetryAfterMs(response, body)
      );
    }
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

/**
 * Runs the chat call + validation once, with a single retry on a recoverable
 * failure: either our own schema validation rejected the response, or the
 * model itself occasionally fails to produce well-formed JSON (surfaced by
 * Groq as an AiProviderError, e.g. "json_validate_failed") — both are worth
 * one more attempt before giving up. A validation failure gets the specific
 * error appended so the retry can address it directly; a provider-side
 * failure just retries the same prompt fresh. Config/timeout errors are not
 * retried since a second attempt won't fix either.
 */
async function generateWithRetry(messages: { role: "system" | "user"; content: string }[]): Promise<WebsiteConcept> {
  try {
    return validate(await callChatJson(messages));
  } catch (err) {
    if (err instanceof AiValidationError) {
      messages.push(
        { role: "user", content: "That response did not match the required shape." },
        { role: "user", content: `Validation errors: ${err.message}. Return corrected JSON only.` }
      );
      return validate(await callChatJson(messages));
    }
    if (err instanceof AiRateLimitError) {
      await sleep(err.retryAfterMs);
      return validate(await callChatJson(messages));
    }
    if (err instanceof AiProviderError) {
      return validate(await callChatJson(messages));
    }
    throw err;
  }
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

  return generateWithRetry(messages);
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

  return generateWithRetry(messages);
}
