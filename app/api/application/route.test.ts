/** @jest-environment node */
import { NextRequest } from "next/server";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { isRateLimited, resetRateLimit } from "@/lib/rateLimit";

jest.mock("@/lib/prisma", () => ({
  prisma: { lead: { create: jest.fn() }, $queryRaw: jest.fn() },
}));
jest.mock("@/lib/notify", () => ({
  notifyNewApplication: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/lib/storage", () => ({
  DOCUMENT_KINDS: [
    { kind: "mc", label: "MC Authority", hint: "" },
    { kind: "w9", label: "W-9 Form", hint: "" },
    { kind: "coi", label: "COI", hint: "" },
    { kind: "noa", label: "NOA", hint: "" },
    { kind: "voided-cheque", label: "Voided Cheque", hint: "" },
  ],
  proveObjectExists: jest.fn(),
}));
jest.mock("@/lib/rateLimit", () => ({
  isRateLimited: jest.fn().mockResolvedValue(false),
  resetRateLimit: jest.fn(),
}));

const mockedCreate = prisma.lead.create as jest.Mock;
const mockedRateLimited = isRateLimited as jest.Mock;
const mockedProve = jest.requireMock("@/lib/storage")
  .proveObjectExists as jest.Mock;

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/application", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.5",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid: Record<string, unknown> = {
  firstName: "Jane",
  lastName: "Doe",
  company: "Doe Trucking LLC",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  mcNumber: "MC123456",
  usdotNumber: "1234567",
  equipmentType: "flatbed",
  truckCount: 2,
  currentLocation: "Columbus, OH",
  preferredLanes: "Midwest to Southeast",
  preferredRegions: "Ohio, Georgia, Tennessee",
  homeTime: "home weekly",
  message: "Looking for dedicated dispatch support.",
  smsOptIn: true,
};

beforeEach(() => {
  resetRateLimit();
  jest.clearAllMocks();
});

afterEach(() => {
  resetRateLimit();
});

describe("POST /api/application", () => {
  it("stores a valid application with source and consent timestamp", async () => {
    mockedCreate.mockResolvedValueOnce({ id: "lead_1" });

    const res = await POST(makeRequest(valid));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });

    expect(mockedCreate).toHaveBeenCalledTimes(1);
    const data = mockedCreate.mock.calls[0][0].data;
    expect(data.firstName).toBe("Jane");
    expect(data.email).toBe("jane@example.com");
    expect(data.equipmentType).toBe("flatbed");
    expect(data.truckCount).toBe(2);
    expect(data.source).toBe("application");
    expect(data.smsOptIn).toBe(true);
    expect(data.consentTimestamp).toBeInstanceOf(Date);
  });

  it("rejects an invalid application with 400 and stores nothing", async () => {
    const res = await POST(makeRequest({ ...valid, mcNumber: "!!not-an-mc!!" }));
    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns a generic 500 and hides database details on failure", async () => {
    mockedCreate.mockRejectedValueOnce(
      new Error("connect ECONNREFUSED secret-db-host:5432")
    );

    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toContain("secret-db-host");
    expect(JSON.stringify(body)).not.toContain("ECONNREFUSED");
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(makeRequest("{not json"));
    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("stores an application with missing SMS consent as smsOptIn=false", async () => {
    mockedCreate.mockResolvedValueOnce({ id: "lead_2" });

    const withoutConsent = { ...valid };
    delete withoutConsent.smsOptIn;

    const res = await POST(makeRequest(withoutConsent));
    expect(res.status).toBe(201);

    const data = mockedCreate.mock.calls[0][0].data;
    expect(data.smsOptIn).toBe(false);
    expect(data.consentTimestamp).toBeNull();
  });

  it("rate-limits repeated duplicate requests with 429", async () => {
    mockedCreate.mockResolvedValue({ id: "lead" });

    for (let i = 0; i < 10; i += 1) {
      const res = await POST(makeRequest(valid));
      expect(res.status).toBe(201);
    }

    mockedRateLimited.mockResolvedValueOnce(true);
    const blocked = await POST(makeRequest(valid));
    expect(blocked.status).toBe(429);
    expect(mockedCreate).toHaveBeenCalledTimes(10);
  });

  it("rejects an oversized body with 413 before storing", async () => {
    const res = await POST(makeRequest({ ...valid, message: "x".repeat(400_000) }));
    expect(res.status).toBe(413);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("strips unexpected fields before storing", async () => {
    mockedCreate.mockResolvedValueOnce({ id: "lead_3" });

    const res = await POST(
      makeRequest({ ...valid, admin: true, role: "superuser", secret_note: "hi" })
    );
    expect(res.status).toBe(201);

    const data = mockedCreate.mock.calls[0][0].data;
    expect(data).not.toHaveProperty("admin");
    expect(data).not.toHaveProperty("role");
    expect(data).not.toHaveProperty("secret_note");
  });

  it("traps a filled honeypot as spam without storing", async () => {
    const res = await POST(
      makeRequest({ ...valid, website: "http://spam.example.com" })
    );
    expect(res.status).toBe(201);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("stores uploaded document metadata with the lead", async () => {
    mockedCreate.mockResolvedValueOnce({ id: "lead_docs" });
    mockedProve.mockResolvedValue(true);

    const withDocs = {
      ...valid,
      documents: [
        {
          kind: "mc",
          objectKey: "applications/mc123456/mc/abc-MC.pdf",
          filename: "MC authority.pdf",
          contentType: "application/pdf",
          size: 4096,
        },
        {
          kind: "w9",
          objectKey: "applications/mc123456/w9/abc-W9.pdf",
          filename: "W9.pdf",
          contentType: "application/pdf",
          size: 2048,
        },
      ],
    };

    const res = await POST(makeRequest(withDocs));
    expect(res.status).toBe(201);
    expect(mockedProve).toHaveBeenCalledTimes(2);
    expect(mockedCreate).toHaveBeenCalledTimes(1);

    const data = mockedCreate.mock.calls[0][0].data;
    expect(data.documents.create).toHaveLength(2);
    expect(data.documents.create[0]).toMatchObject({
      kind: "mc",
      objectKey: "applications/mc123456/mc/abc-MC.pdf",
      filename: "MC authority.pdf",
      contentType: "application/pdf",
      size: 4096,
    });
  });

  it("rejects an application when a claimed document is missing from storage", async () => {
    mockedProve.mockResolvedValue(false);

    const withDocs = {
      ...valid,
      documents: [
        {
          kind: "coi",
          objectKey: "applications/mc123456/coi/abc-COI.pdf",
          filename: "COI.pdf",
          contentType: "application/pdf",
          size: 4096,
        },
      ],
    };

    const res = await POST(makeRequest(withDocs));
    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });
});