import "server-only";

export class AiConfigError extends Error {}
export class AiModerationError extends Error {}
export class AiProviderError extends Error {}
export class AiTimeoutError extends Error {}
export class AiValidationError extends Error {}

const REQUEST_TIMEOUT_MS = 45_000;

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

export function getOpenAiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new AiConfigError("OPENAI_API_KEY is not configured.");
  }
  return key;
}

export const OPENAI_API_BASE = "https://api.openai.com/v1";
