import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Raw admin password from env, or null when admin is disabled / too short. */
export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length >= 8 ? password : null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", `autohausia-admin:${secret}`)
    .update(payload)
    .digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
}

/** Build the signed session cookie value (stateless, HMAC-signed). */
export function createSessionToken(password: string): string {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload, password)}`;
}

/** Returns true when the request carries a valid admin session cookie. */
export function hasValidSession(): boolean {
  const password = getAdminPassword();
  if (!password) return false;

  const raw = cookies().get(ADMIN_COOKIE)?.value;
  if (!raw) return false;

  const dot = raw.indexOf(".");
  if (dot === -1) return false;

  const payload = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  if (!payload.startsWith("admin:") || !signature) return false;

  const [issuedAt] = payload.slice("admin:".length).split(".");
  const ageSeconds =
    (Date.now() - Number.parseInt(issuedAt, 10)) / 1000;
  if (!Number.isFinite(ageSeconds) || ageSeconds > SESSION_TTL_SECONDS) {
    return false;
  }

  return constantTimeEqual(signature, sign(payload, password));
}

/** Constant-time password comparison used by the login route. */
export function passwordsMatch(submitted: string, password: string): boolean {
  return constantTimeEqual(
    createHmac("sha256", `autohausia-admin:${password}`)
      .update(`pw:${submitted}`)
      .digest("hex"),
    createHmac("sha256", `autohausia-admin:${password}`)
      .update(`pw:${password}`)
      .digest("hex")
  );
}

export { ADMIN_COOKIE };