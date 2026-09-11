import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cleanText } from "@/lib/sanitize";
import { isRateLimited } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";
import { notifyNewApplication } from "@/lib/notify";
import { DOCUMENT_KINDS, type DocumentKind, proveObjectExists } from "@/lib/storage";

const MAX_BODY_BYTES = 128 * 1024;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const EquipmentType = z.enum([
  "flatbed",
  "step-deck",
  "dry-van",
  "power-only",
  "box-truck",
  "hotshot",
]);

const ApplicationDocumentSchema = z.object({
  kind: z.enum(DOCUMENT_KINDS.map((d) => d.kind) as [DocumentKind, ...DocumentKind[]]),
  objectKey: z.string().trim().min(1).max(512),
  filename: z.string().trim().min(1).max(255).transform(cleanText),
  contentType: z.string().trim().min(1).max(200),
  size: z.coerce.number().int().positive().max(10 * 1024 * 1024),
});

const ApplicationSchema = z.object({
  firstName: z.string().trim().min(1).max(100).transform(cleanText),
  lastName: z.string().trim().min(1).max(100).transform(cleanText),
  company: z.string().trim().max(200).optional().default("").transform(cleanText),
  email: z
    .string()
    .trim()
    .max(254)
    .email()
    .transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(10).max(40).transform(cleanText),
  mcNumber: z.string().trim().regex(/^(\d{4,8}|MC-?\d{4,8})$/i).max(12).transform(cleanText),
  usdotNumber: z.string().trim().regex(/^\d{6,8}$/).max(8).transform(cleanText),
  equipmentType: EquipmentType,
  truckCount: z.coerce.number().int().positive().max(10_000),
  currentLocation: z.string().trim().min(1).max(200).transform(cleanText),
  preferredLanes: z.string().trim().max(500).optional().default("").transform(cleanText),
  preferredRegions: z.string().trim().max(500).optional().default("").transform(cleanText),
  homeTime: z.string().trim().max(500).optional().default("").transform(cleanText),
  message: z.string().trim().max(5000).optional().default("").transform(cleanText),
  smsOptIn: z.boolean().default(false),
  documents: z.array(ApplicationDocumentSchema).max(10).optional().default([]),
});

export async function POST(req: NextRequest) {
  if (await isRateLimited(`application:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
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

  const parsed = ApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }
  const data = parsed.data;

  // If documents were claimed as uploaded, verify each object actually exists
  // in storage before saving a lead that references it. Run verifications in
  // parallel so a multi-document application does not serialize N network calls.
  if (data.documents.length > 0) {
    const results = await Promise.allSettled(
      data.documents.map((doc) => proveObjectExists(doc.objectKey))
    );

    const missingIndex = results.findIndex((r) => r.status === "fulfilled" && !r.value);
    if (missingIndex !== -1) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "One or more uploaded documents could not be verified. Please re-upload and try again.",
        },
        { status: 400 }
      );
    }

    const rejected = results.find(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult | undefined;
    if (rejected) {
      console.error("[api/application] failed to verify document", {
        error:
          rejected.reason instanceof Error
            ? rejected.reason.message
            : String(rejected.reason),
      });
      return NextResponse.json(
        {
          ok: false,
          error: "Could not verify an uploaded document. Please try again.",
        },
        { status: 500 }
      );
    }
  }

  try {
    await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        phone: data.phone,
        mcNumber: data.mcNumber,
        usdotNumber: data.usdotNumber,
        equipmentType: data.equipmentType,
        truckCount: data.truckCount,
        currentLocation: data.currentLocation,
        preferredLanes: data.preferredLanes,
        preferredRegions: data.preferredRegions,
        homeTime: data.homeTime,
        message: data.message,
        smsOptIn: data.smsOptIn,
        consentTimestamp: data.smsOptIn ? new Date() : null,
        source: "application",
        documents:
          data.documents.length > 0
            ? {
                create: data.documents.map((d) => ({
                  kind: d.kind,
                  objectKey: d.objectKey,
                  filename: d.filename,
                  contentType: d.contentType,
                  size: d.size,
                })),
              }
            : undefined,
      },
    });
    await notifyNewApplication({ ...data, documents: data.documents });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/application] failed to store lead", {
      source: "application",
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}