import { Resend } from "resend";
import { objectUrl } from "@/lib/storage";

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
  if (docs.length > 0) {
    lines.push("", "Documents:");
    for (const doc of docs) {
      const url = objectUrl(doc.objectKey);
      lines.push(`  - ${doc.kind}: ${doc.filename}${url ? ` (${url})` : ""}`);
    }
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `New carrier application: ${data.firstName} ${data.lastName}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    // A notification failure must never fail the application submission.
    console.error("[notify] failed to send application email", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}