/** @jest-environment node */
import { NextRequest } from "next/server";
import { POST } from "./route";
import { isRateLimited } from "@/lib/rateLimit";

jest.mock("@/lib/rateLimit", () => ({
  isRateLimited: jest.fn().mockResolvedValue(false),
  resetRateLimit: jest.fn(),
}));

jest.mock("@/lib/clientIp", () => ({
  clientIp: jest.fn(() => "203.0.113.5"),
}));

const mockedRateLimited = isRateLimited as jest.Mock;

const OLD_ENV = process.env;

function makeRequest(password: string) {
  return new NextRequest("http://localhost/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

beforeEach(() => {
  process.env = { ...OLD_ENV };
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("POST /api/admin/login", () => {
  it("rejects the login when admin is not configured", async () => {
    delete process.env.ADMIN_PASSWORD;
    const res = await POST(makeRequest("whatever"));
    expect(res.status).toBe(503);
  });

  it("rejects an incorrect password without setting a session cookie", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
    const res = await POST(makeRequest("wrong-password"));
    expect(res.status).toBe(401);
    expect(res.cookies.get("admin_session")?.value).toBeUndefined();
  });

  it("accepts the correct password and sets an httpOnly session cookie", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
    const res = await POST(makeRequest("correct-horse-battery-staple"));

    expect(res.status).toBe(200);
    const cookie = res.cookies.get("admin_session");
    expect(cookie?.value).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.path).toBe("/");
    expect(cookie?.sameSite).toBe("lax");
  });

  it("rejects a request with no password body", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
    const res = await POST(
      new NextRequest("http://localhost/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rate-limits repeated login attempts", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
    mockedRateLimited.mockResolvedValueOnce(true);
    const res = await POST(makeRequest("correct-horse-battery-staple"));
    expect(res.status).toBe(429);
  });
});