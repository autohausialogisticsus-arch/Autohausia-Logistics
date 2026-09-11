/** @jest-environment node */
import { notifyNewApplication } from "./notify";
import { readObjectBytes } from "@/lib/storage";

const sendMock = jest.fn().mockResolvedValue({ data: { id: "email_1" } });

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

jest.mock("@/lib/storage", () => ({
  objectUrl: jest.fn(() => "https://cdn.example.test/applications/x.pdf"),
  readObjectBytes: jest.fn(),
}));

const mockedRead = readObjectBytes as jest.Mock;

const OLD_ENV = process.env;

function baseData() {
  return {
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
    smsOptIn: false,
  };
}

beforeEach(() => {
  process.env = {
    ...OLD_ENV,
    RESEND_API_KEY: "re_test_key",
    RESEND_FROM: "onboarding@resend.dev",
    APPLICATION_NOTIFY_TO: "owner@gmail.com",
  };
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("notifyNewApplication", () => {
  it("does nothing when email settings are missing", async () => {
    delete process.env.RESEND_API_KEY;
    await notifyNewApplication(baseData());
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("attaches uploaded documents to the email", async () => {
    mockedRead.mockResolvedValue({
      data: Buffer.from("%PDF-1.4 fake"),
      contentType: "application/pdf",
    });

    await notifyNewApplication({
      ...baseData(),
      documents: [
        {
          kind: "mc",
          filename: "MC authority.pdf",
          objectKey: "applications/x/mc/a.pdf",
        },
        {
          kind: "w9",
          filename: "W9.pdf",
          objectKey: "applications/x/w9/b.pdf",
        },
      ],
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    const call = sendMock.mock.calls[0][0];
    expect(call.to).toBe("owner@gmail.com");
    expect(call.attachments).toHaveLength(2);
    expect(call.attachments[0]).toMatchObject({
      filename: "MC authority.pdf",
    });
    expect(call.attachments[1]).toMatchObject({ filename: "W9.pdf" });
    expect(call.text).toContain("Documents:");
    expect(call.text).toContain("MC authority.pdf (https://cdn.example.test/applications/x.pdf)");
  });

  it("skips attaching a document that is too large but keeps its link", async () => {
    mockedRead.mockResolvedValue(null);

    await notifyNewApplication({
      ...baseData(),
      documents: [
        {
          kind: "coi",
          filename: "COI.pdf",
          objectKey: "applications/x/coi/big.pdf",
        },
      ],
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    const call = sendMock.mock.calls[0][0];
    expect(call.attachments).toBeUndefined();
    expect(call.text).toContain("COI.pdf");
    expect(call.text).toContain("https://cdn.example.test/applications/x.pdf");
  });
});