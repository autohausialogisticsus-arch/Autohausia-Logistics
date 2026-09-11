import { prisma } from "@/lib/prisma";

type Entry = {
  count: number;
  resetAt: number;
};

// In-memory fallback for environments where the database is unreachable.
// WARNING: this is per-process state — it does not enforce limits across
// serverless instances or multiple hosts. It exists so API routes still
// provide basic protection (and never crash) when the DB is unavailable.
const bucket = new Map<string, Entry>();

function sweepExpired(now: number) {
  if (bucket.size > 10_000) {
    for (const [key, entry] of bucket) {
      if (now >= entry.resetAt) bucket.delete(key);
    }
  }
}

function isRateLimitedInMemory(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || now >= entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    sweepExpired(now);
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

// DB-backed, atomic token bucket. Uses an UPSERT so concurrent requests from
// the same key never interleave a stale read-then-write, and expired windows
// are reset in place. Failures fall back to the in-memory limiter so traffic
// is never hard-blocked by a transient database outage.
export async function isRateLimited(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<boolean> {
  const resetAt = new Date(Date.now() + windowMs);

  try {
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt", "updatedAt")
      VALUES (${key}, 1, ${resetAt}, NOW())
      ON CONFLICT ("key") DO UPDATE
      SET "count" = CASE
        WHEN "RateLimit"."resetAt" <= NOW() THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimit"."resetAt" <= NOW() THEN ${resetAt}
        ELSE "RateLimit"."resetAt"
      END,
      "updatedAt" = NOW()
      RETURNING "count"
    `;

    return rows[0].count > limit;
  } catch (err) {
    console.error("[rateLimit] database limiter failed, using in-memory fallback", {
      error: err instanceof Error ? err.message : String(err),
    });
    return isRateLimitedInMemory(key, limit, windowMs);
  }
}

export function resetRateLimit() {
  bucket.clear();
}