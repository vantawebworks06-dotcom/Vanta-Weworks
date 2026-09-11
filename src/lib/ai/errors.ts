import "server-only";

export class AiConfigError extends Error {}
export class AiModerationError extends Error {}
export class AiProviderError extends Error {}
export class AiTimeoutError extends Error {}
export class AiValidationError extends Error {}

/** A provider-side 429. Carries how long to wait before it's worth retrying. */
export class AiRateLimitError extends AiProviderError {
  constructor(
    message: string,
    public readonly retryAfterMs: number
  ) {
    super(message);
  }
}

// Groq's free tier enforces a fairly tight tokens-per-minute budget, so a
// single request occasionally needs a short wait-and-retry (see
// AiRateLimitError) rather than a long hang — keep the per-call ceiling
// modest so two sequential attempts still comfortably fit inside a
// serverless function's execution limit.
const REQUEST_TIMEOUT_MS = 25_000;

export async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
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

const DEFAULT_RETRY_AFTER_MS = 2_500;
const MAX_RETRY_AFTER_MS = 6_000;

/** Reads how long to wait before retrying a 429 — the Retry-After header if
 * present, else Groq's "Please try again in X.Xs" wording in the error body,
 * else a small default. Capped so a retry still comfortably fits the
 * per-call timeout budget. */
export function parseRetryAfterMs(response: Response, body: string): number {
  const header = response.headers.get("retry-after");
  const headerSeconds = header ? Number(header) : NaN;
  if (!Number.isNaN(headerSeconds)) return Math.min(headerSeconds * 1000, MAX_RETRY_AFTER_MS);

  const match = body.match(/try again in ([\d.]+)s/i);
  if (match) return Math.min(Number(match[1]) * 1000, MAX_RETRY_AFTER_MS);

  return DEFAULT_RETRY_AFTER_MS;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new AiConfigError("GROQ_API_KEY is not configured.");
  }
  return key;
}

// Groq's API is OpenAI-compatible (same request/response shape), reached at
// this base URL instead of api.openai.com. See https://console.groq.com.
export const GROQ_API_BASE = "https://api.groq.com/openai/v1";
