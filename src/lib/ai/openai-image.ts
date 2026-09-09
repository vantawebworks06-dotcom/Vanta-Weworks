import "server-only";
import { OPENAI_API_BASE, withTimeout, getOpenAiKey, AiModerationError, AiProviderError } from "@/lib/ai/errors";

export { AiConfigError, AiModerationError, AiProviderError, AiTimeoutError } from "@/lib/ai/errors";

/**
 * Runs user-provided text through OpenAI's moderation endpoint before it's
 * ever used to build an image-generation or concept-generation prompt.
 * Throws AiModerationError if the content is flagged.
 */
export async function moderateText(text: string): Promise<void> {
  const apiKey = getOpenAiKey();

  const response = await withTimeout((signal) =>
    fetch(`${OPENAI_API_BASE}/moderations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
      signal,
    })
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new AiProviderError(`Moderation request failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    results?: { flagged: boolean }[];
  };

  if (data.results?.[0]?.flagged) {
    throw new AiModerationError("The description did not pass content moderation.");
  }
}

export type ConceptImageInput = {
  description: string;
  industry?: string;
  style?: string;
  colors?: string;
  targetAudience?: string;
  features?: string;
};

export function buildImagePrompt(input: ConceptImageInput): string {
  const parts = [
    `A professional website design concept mockup, shown as a modern browser window screenshot of a homepage${
      input.industry ? ` for a ${input.industry} business` : " for a business"
    }.`,
    `Business description: ${input.description}.`,
    input.style ? `Visual style: ${input.style}.` : null,
    input.colors ? `Color palette: ${input.colors}.` : null,
    input.targetAudience ? `Target audience: ${input.targetAudience}.` : null,
    input.features ? `Key features to visually suggest: ${input.features}.` : null,
    "High-quality, premium modern web design UI/UX, clean layout, strong visual hierarchy, realistic browser chrome.",
    "Do not render any readable text, logos, or brand names in the image.",
  ];

  return parts.filter(Boolean).join(" ");
}

/**
 * Generates a single image and returns it as raw bytes (PNG) plus the exact
 * prompt that was used. Used both for the (legacy) full-mockup image and,
 * optionally, a single hero background image for a structured concept.
 */
export async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = getOpenAiKey();

  const response = await withTimeout((signal) =>
    fetch(`${OPENAI_API_BASE}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1536x1024",
        n: 1,
      }),
      signal,
    })
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new AiProviderError(`Image generation failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    data?: { b64_json?: string }[];
  };

  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new AiProviderError("Image generation returned an unexpected response shape.");
  }

  return Buffer.from(b64, "base64");
}

export async function generateConceptImage(
  input: ConceptImageInput
): Promise<{ imageBytes: Buffer; promptUsed: string }> {
  const promptUsed = buildImagePrompt(input);
  const imageBytes = await generateImage(promptUsed);
  return { imageBytes, promptUsed };
}
