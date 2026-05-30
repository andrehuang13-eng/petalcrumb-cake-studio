import "server-only";
import { headers } from "next/headers";

// Lightweight, best-effort rate limiter. In-memory + per-instance: on
// serverless this resets on cold start and isn't shared across instances, so
// it's a speed bump against bursts/bots, not a hard security boundary. For
// production-grade limiting, back this with Upstash/Redis. Adequate (and
// documented as such) for a concept project.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export async function clientKey(prefix: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return `${prefix}:${ip}`;
}

/**
 * @returns true if allowed, false if the limit is exceeded.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = store.get(key);
  if (!b || now > b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
