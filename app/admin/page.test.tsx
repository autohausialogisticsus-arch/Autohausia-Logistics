/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import AdminPage from "./page";
import { hasValidSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/adminAuth", () => ({
  hasValidSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: { lead: { findMany: jest.fn() } },
}));

jest.mock("@/lib/storage", () => ({
  objectUrl: jest.fn(() => "https://cdn.example.test/applications/x.pdf"),
}));

const mockedSession = hasValidSession as jest.Mock;
const mockedFindMany = prisma.lead.findMany as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Admin leads page", () => {
  it("blocks the page for visitors without a valid session", async () => {
    mockedSession.mockReturnValue(false);
    await expect(AdminPage()).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
    expect(mockedFindMany).not.toHaveBeenCalled();
  });

  it("renders submitted leads for an authenticated user", async () => {
    mockedSession.mockReturnValue(true);
    mockedFindMany.mockResolvedValueOnce([
      {
        id: "lead_1",
        name: null,
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
        preferredRegions: null,
        homeTime: null,
        message: "Looking for dispatch support.",
        smsOptIn: true,
        consentTimestamp: null,
        newsletter: false,
        source: "application",
        status: "NEW",
        createdAt: new Date("2026-09-10T12:00:00Z"),
        updatedAt: new Date("2026-09-10T12:00:00Z"),
        documents: [
          {
            id: "doc_1",
            leadId: "lead_1",
            kind: "mc",
            objectKey: "applications/x/mc/a.pdf",
            filename: "MC authority.pdf",
            contentType: "application/pdf",
            size: 4096,
            createdAt: new Date("2026-09-10T12:00:00Z"),
          },
        ],
      },
    ]);

    await render(await AdminPage());

    expect(screen.getByText("Jane Doe · Doe Trucking LLC")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("MC MC123456")).toBeInTheDocument();
    expect(screen.getByText("MC · MC authority.pdf").closest("a")).toHaveAttribute(
      "href",
      "https://cdn.example.test/applications/x.pdf"
    );
  });

  it("shows an empty state when there are no leads", async () => {
    mockedSession.mockReturnValue(true);
    mockedFindMany.mockResolvedValueOnce([]);

    await render(await AdminPage());

    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
  });
});