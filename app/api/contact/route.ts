import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cleanText } from "@/lib/sanitize";
import { isRateLimited } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";
import { notifyNewContact } from "@/lib/notify";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200).transform(cleanText),
  email: z
    .string()
    .trim()
    .max(254)
    .email()
    .transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(40).transform(cleanText),
  message: z.string().trim().min(1).max(5000).transform(cleanText),
  smsOptIn: z.boolean().optional().default(false),
  newsletter: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  if (await isRateLimited(`contact:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)) },
      }
    );
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request body too large." },
      { status: 413 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported media type." },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON request body." },
      { status: 400 }
    );
  }

  const honeypot = (body as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }
  const data = parsed.data;

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        smsOptIn: data.smsOptIn,
        newsletter: data.newsletter,
        consentTimestamp: data.smsOptIn ? new Date() : null,
        source: "contact",
      },
    });

    await notifyNewContact(data);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/contact] failed to store lead", {
      source: "contact",
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}