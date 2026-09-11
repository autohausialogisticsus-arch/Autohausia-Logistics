import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";
import {
  DOCUMENT_KINDS,
  type DocumentKind,
  createPresignedUploadUrl,
  isSupportedFile,
  isStorageConfigured,
  normalizeFilename,
} from "@/lib/storage";

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

const UploadSchema = z.object({
  kind: z.enum(DOCUMENT_KINDS.map((d) => d.kind) as [DocumentKind, ...DocumentKind[]]),
  filename: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(200),
  size: z.coerce.number().int().positive().max(10 * 1024 * 1024),
  mcNumber: z.string().trim().regex(/^[A-Z]*\d{4,8}$/i).max(12),
});

export async function POST(req: NextRequest) {
  if (await isRateLimited(`upload-url:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)) },
      }
    );
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Document uploads are not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 }
    );
  }

  const parsed = UploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid upload request." }, { status: 400 });
  }

  const { kind, filename, contentType, size, mcNumber } = parsed.data;

  if (!isSupportedFile(contentType, size)) {
    return NextResponse.json(
      { ok: false, error: "Unsupported file type or size. Use a PDF or image under 10 MB." },
      { status: 415 }
    );
  }

  try {
    const safeFile = normalizeFilename(filename);
    const result = await createPresignedUploadUrl({
      prefix: mcNumber.toLowerCase(),
      kind,
      filename: safeFile,
      contentType,
      size,
    });
    return NextResponse.json({ ok: true, url: result.url, key: result.key });
  } catch (err) {
    console.error("[api/application/upload-url] failed to presign", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "Could not prepare upload. Please try again." },
      { status: 500 }
    );
  }
}
