import { NextRequest } from "next/server";

// Returns a best-effort client IP for rate-limit keys. `req.ip` is populated
// by the hosting platform (e.g. Vercel) from a trusted proxy chain, so it is
// preferred. The x-forwarded-for / x-real-ip headers are only a fallback for
// local development where `req.ip` is not set — on shared hosts they can be
// spoofed by a client unless the platform strips/replaces them.
export function clientIp(req: NextRequest): string {
  return (
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}