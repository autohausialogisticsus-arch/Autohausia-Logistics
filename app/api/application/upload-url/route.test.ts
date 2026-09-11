/** @jest-environment node */
import { NextRequest } from "next/server";
import { POST } from "./route";
import {
  createPresignedUploadUrl,
  isStorageConfigured,
  isSupportedFile,
} from "@/lib/storage";
import { isRateLimited } from "@/lib/rateLimit";

const mockPresign = createPresignedUploadUrl as jest.Mock;
const mockConfigured = isStorageConfigured as jest.Mock;
const mockRateLimited = isRateLimited as jest.Mock;

jest.mock("@/lib/storage", () => ({
  DOCUMENT_KINDS: [
    { kind: "mc", label: "MC Authority", hint: "" },
    { kind: "w9", label: "W-9 Form", hint: "" },
    { kind: "coi", label: "COI", hint: "" },
    { kind: "noa", label: "NOA", hint: "" },
    { kind: "voided-cheque", label: "Voided Cheque", hint: "" },
  ],
  isStorageConfigured: jest.fn(),
  createPresignedUploadUrl: jest.fn(),
  isSupportedFile: jest.fn().mockReturnValue(true),
  normalizeFilename: jest.fn((f: string) => f),
}));
jest.mock("@/lib/rateLimit", () => ({
  isRateLimited: jest.fn().mockReturnValue(false),
}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/application/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const valid = {
  kind: "mc",
  filename: "MC authority.pdf",
  contentType: "application/pdf",
  size: 4096,
  mcNumber: "MC123456",
};

describe("POST /api/application/upload-url", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigured.mockReturnValue(true);
    mockPresign.mockResolvedValue({
      url: "https://s3.example.com/presigned",
      key: "applications/mc123456/mc/abc.pdf",
    });
  });

  it("returns a presigned upload URL when storage is configured", async () => {
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      ok: true,
      url: "https://s3.example.com/presigned",
      key: "applications/mc123456/mc/abc.pdf",
    });
    expect(mockPresign).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "mc", filename: "MC authority.pdf" })
    );
  });

  it("returns 503 with a clear message when storage is not configured", async () => {
    mockConfigured.mockReturnValue(false);
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain("not configured");
    expect(mockPresign).not.toHaveBeenCalled();
  });

  it("rejects an invalid kind with 400", async () => {
    const res = await POST(makeRequest({ ...valid, kind: "invoice" }));
    expect(res.status).toBe(400);
    expect(mockPresign).not.toHaveBeenCalled();
  });

  it("rejects an unsupported file type with 415", async () => {
    mockPresign.mockClear();
    (isSupportedFile as jest.Mock).mockReturnValueOnce(false);
    const res = await POST(makeRequest({ ...valid, contentType: "video/mp4" }));
    expect(res.status).toBe(415);
    expect(mockPresign).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    mockRateLimited.mockReturnValue(true);
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(429);
    expect(mockPresign).not.toHaveBeenCalled();
  });
});
