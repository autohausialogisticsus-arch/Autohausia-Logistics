import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  type DocumentKind,
  DOCUMENT_KINDS,
  ACCEPTED_MIME_TYPES as ACCEPTED_MIME_SET,
  MAX_DOC_BYTES,
} from "@/lib/documentTypes";

const region = process.env.S3_REGION ?? "auto";
const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? "";

let client: S3Client | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(bucket && accessKeyId && secretAccessKey);
}

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    region,
    ...(endpoint ? { endpoint } : {}),
    forcePathStyle: endpoint ? true : undefined,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  return client;
}

export type { DocumentKind } from "@/lib/documentTypes";
export { DOCUMENT_KINDS, MAX_DOC_BYTES } from "@/lib/documentTypes";

export const ACCEPTED_MIME_TYPES: ReadonlySet<string> = new Set(ACCEPTED_MIME_SET);

const SAFE_EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/webp": "webp",
};

export function normalizeFilename(filename: string): string {
  const base = filename.trim().replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_");
  return base.length === 0 ? "document" : base;
}

export function extensionForMime(mime: string): string {
  return SAFE_EXT_BY_MIME[mime] ?? "bin";
}

export function isSupportedFile(mime: string, size: number): boolean {
  return ACCEPTED_MIME_TYPES.has(mime) && size > 0 && size <= MAX_DOC_BYTES;
}

function buildKey({
  prefix,
  kind,
  filename,
}: {
  prefix: string;
  kind: DocumentKind;
  filename: string;
}): string {
  const safe = normalizeFilename(filename);
  const dot = safe.lastIndexOf(".");
  const name = dot > 0 ? safe.slice(0, dot) : safe;
  const ext = extFromName(safe);
  const id = crypto.randomUUID().slice(0, 12);
  return `applications/${prefix}/${kind}/${id}-${name}${ext}`;
}

function extFromName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot > 0 && dot < filename.length - 1) return filename.slice(dot);
  return "";
}

export async function createPresignedUploadUrl({
  prefix,
  kind,
  filename,
  contentType,
  size,
}: {
  prefix: string;
  kind: DocumentKind;
  filename: string;
  contentType: string;
  size: number;
}): Promise<{ url: string; key: string }> {
  if (!isStorageConfigured()) {
    throw new Error("Document storage is not configured.");
  }
  const key = buildKey({ prefix, kind, filename });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });
  const url = await getSignedUrl(getClient(), command, { expiresIn: 60 * 15 });
  return { url, key };
}

export async function proveObjectExists(key: string): Promise<boolean> {
  if (!isStorageConfigured()) return false;
  try {
    await getClient().send(
      new HeadObjectCommand({ Bucket: bucket, Key: key })
    );
    return true;
  } catch {
    return false;
  }
}

export async function readObjectBytes(
  key: string,
  maxBytes: number
): Promise<{ data: Buffer; contentType: string } | null> {
  if (!isStorageConfigured()) return null;
  try {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    const contentLength = Number(res.ContentLength ?? 0);
    if (!res.Body || contentLength < 1 || contentLength > maxBytes) return null;
    const bytes = await res.Body.transformToByteArray();
    if (bytes.length < 1 || bytes.length > maxBytes) return null;
    return {
      data: Buffer.from(bytes),
      contentType: res.ContentType ?? "application/octet-stream",
    };
  } catch {
    return null;
  }
}

export function objectUrl(key: string): string | null {
  if (!bucket) return null;
  const publicBase = process.env.S3_PUBLIC_BASE_URL;
  if (publicBase) {
    // For Supabase Storage set this to your public bucket URL, e.g.
    // https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>
    return `${publicBase.replace(/\/$/, "")}/${key
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  }
  const s3Endpoint =
    process.env.S3_ENDPOINT ?? `https://s3.${region}.amazonaws.com`;
  return `${s3Endpoint.replace(/\/$/, "")}/${bucket}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
