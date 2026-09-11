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
// A provider-reported wait longer than this almost certainly means the
// account is well over budget for the minute, not just brushing the limit —
// sanity-cap what we'd ever display/wait on rather than trust an unbounded
// number.
const MAX_SUGGESTED_WAIT_MS = 60_000;
// Separate, tighter cap on how long we'll actually sleep before our own
// in-process retry (see AiRateLimitError) — a retry still needs to
// comfortably fit inside the per-call timeout budget.
export const MAX_BACKOFF_MS = 6_000;

/** Reads how long the provider says to wait before retrying a 429 — the
 * Retry-After header if present, else Groq's "Please try again in X.Xs"
 * wording in the error body, else a small default. This is the *true*
 * suggested wait (sanity-capped, not artificially shortened) — callers that
 * sleep before an immediate in-process retry should further cap it with
 * MAX_BACKOFF_MS; callers building a user-facing "try again in Ns" message
 * should use it as-is. */
export function parseRetryAfterMs(response: Response, body: string): number {
  const header = response.headers.get("retry-after");
  const headerSeconds = header ? Number(header) : NaN;
  if (!Number.isNaN(headerSeconds)) return Math.min(headerSeconds * 1000, MAX_SUGGESTED_WAIT_MS);

  const match = body.match(/try again in ([\d.]+)s/i);
  if (match) return Math.min(Number(match[1]) * 1000, MAX_SUGGESTED_WAIT_MS);

  return DEFAULT_RETRY_AFTER_MS;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** User-facing "try again in Ns" phrasing for an AiRateLimitError, rounded
 * up to a whole second (never "0 seconds"). */
export function formatRetryMessage(retryAfterMs: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return `We're generating a lot of concepts right now. Please try again in about ${seconds} second${seconds === 1 ? "" : "s"}.`;
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
