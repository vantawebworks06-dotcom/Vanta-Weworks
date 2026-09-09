/**
 * Minimal in-memory sliding-window rate limiter, keyed by an identifier
 * (typically client IP). Good enough to blunt casual form/API abuse
 * without adding an external dependency.
 *
 * Caveat: state lives in the serverless function's memory, so it resets on
 * cold start and is not shared across concurrent instances. For strict,
 * distributed rate limiting under real load, back this with a durable
 * store instead (e.g. Upstash Redis, Vercel KV) — not provisioned here.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

/** Best-effort client IP extraction behind Vercel's proxy. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
