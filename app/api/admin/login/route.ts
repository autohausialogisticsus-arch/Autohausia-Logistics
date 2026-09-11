import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminPassword,
  passwordsMatch,
} from "@/lib/adminAuth";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  if (await isRateLimited(`admin-login:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a minute." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)) },
      }
    );
  }

  const password = getAdminPassword();
  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Admin access is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const submitted = (body as { password?: unknown }).password;
  if (typeof submitted !== "string" || submitted.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Enter the admin password." },
      { status: 400 }
    );
  }

  if (!passwordsMatch(submitted, password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}