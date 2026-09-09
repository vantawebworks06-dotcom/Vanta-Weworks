import "server-only";

const OPENAI_API_BASE = "https://api.openai.com/v1";
const REQUEST_TIMEOUT_MS = 45_000;

export class AiConfigError extends Error {}
export class AiModerationError extends Error {}
export class AiProviderError extends Error {}
export class AiTimeoutError extends Error {}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new AiConfigError("OPENAI_API_KEY is not configured.");
  }
  return key;
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new AiTimeoutError("The AI service took too long to respond.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Runs user-provided text through OpenAI's moderation endpoint before it's
 * ever used to build an image-generation prompt. Throws AiModerationError
 * if the content is flagged.
 */
export async function moderateText(text: string): Promise<void> {
  const apiKey = getApiKey();

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

export type ConceptInput = {
  description: string;
  industry?: string;
  style?: string;
  colors?: string;
  targetAudience?: string;
  features?: string;
};

export function buildConceptPrompt(input: ConceptInput): string {
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
 * Generates a single concept image and returns it as raw bytes (PNG) plus
 * the exact prompt that was used.
 */
export async function generateConceptImage(
  input: ConceptInput
): Promise<{ imageBytes: Buffer; promptUsed: string }> {
  const apiKey = getApiKey();
  const promptUsed = buildConceptPrompt(input);

  const response = await withTimeout((signal) =>
    fetch(`${OPENAI_API_BASE}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: promptUsed,
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

  return { imageBytes: Buffer.from(b64, "base64"), promptUsed };
}
