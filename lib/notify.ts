import { Resend } from "resend";
import { objectUrl, readObjectBytes } from "@/lib/storage";

const MAX_ATTACH_BYTES = 8 * 1024 * 1024; // 8 MB per file
const MAX_TOTAL_ATTACH_BYTES = 25 * 1024 * 1024; // Resend limits ~40 MB/email

type DocumentSummary = {
  kind: string;
  filename: string;
  objectKey: string;
};

type ApplicationSummary = {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  mcNumber: string;
  usdotNumber: string;
  equipmentType: string;
  truckCount: number;
  currentLocation: string;
  preferredLanes?: string;
  preferredRegions?: string;
  homeTime?: string;
  message?: string;
  smsOptIn: boolean;
  documents?: DocumentSummary[];
};

type Attachment = {
  filename: string;
  content: Buffer;
};

type ContactSummary = {
  name: string;
  email: string;
  phone: string;
  message: string;
  smsOptIn: boolean;
  newsletter: boolean;
};

export async function notifyNewContact(data: ContactSummary) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.APPLICATION_NOTIFY_TO;
  if (!apiKey || !from || !to) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `New contact message: ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `SMS consent: ${data.smsOptIn ? "yes" : "no"}`,
        `Newsletter: ${data.newsletter ? "yes" : "no"}`,
        "",
        data.message,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[notify] failed to send contact email", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function notifyNewApplication(data: ApplicationSummary) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.APPLICATION_NOTIFY_TO;
  if (!apiKey || !from || !to) return;

  const lines = [
    `Name: ${data.firstName} ${data.lastName}`,
    data.company ? `Company: ${data.company}` : null,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `MC: ${data.mcNumber}`,
    `USDOT: ${data.usdotNumber}`,
    `Equipment: ${data.equipmentType}`,
    `Trucks: ${data.truckCount}`,
    `Location: ${data.currentLocation}`,
    data.preferredLanes ? `Preferred lanes: ${data.preferredLanes}` : null,
    data.preferredRegions ? `Preferred regions: ${data.preferredRegions}` : null,
    data.homeTime ? `Home time: ${data.homeTime}` : null,
    data.message ? `Message: ${data.message}` : null,
    data.smsOptIn ? "SMS consent: yes" : "SMS consent: no",
  ].filter((l): l is string => l !== null);

  const docs = data.documents ?? [];

  // Download the uploaded documents so they arrive as email attachments.
  const attachments: Attachment[] = [];
  let totalBytes = 0;
  const linesWithUrls = [...lines];

  for (const doc of docs) {
    if (attachments.length < 10 && totalBytes < MAX_TOTAL_ATTACH_BYTES) {
      const file = await readObjectBytes(doc.objectKey, MAX_ATTACH_BYTES);
      if (file) {
        attachments.push({ filename: doc.filename, content: file.data });
        totalBytes += file.data.length;
      }
    }
  }

  if (docs.length > 0) {
    linesWithUrls.push("", "Documents:");
    for (const doc of docs) {
      const url = objectUrl(doc.objectKey);
      linesWithUrls.push(
        `  - ${doc.kind}: ${doc.filename}${url ? ` (${url})` : ""}`
      );
    }
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `New carrier application: ${data.firstName} ${data.lastName}`,
      text: linesWithUrls.join("\n"),
      ...(attachments.length > 0 ? { attachments } : {}),
    });
  } catch (err) {
    // A notification failure must never fail the application submission.
    console.error("[notify] failed to send application email", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}