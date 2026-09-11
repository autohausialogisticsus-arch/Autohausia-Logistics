export type DocumentKind = "mc" | "w9" | "coi" | "noa" | "voided-cheque";

export const DOCUMENT_KINDS: {
  kind: DocumentKind;
  label: string;
  hint: string;
}[] = [
  { kind: "mc", label: "MC Authority", hint: "Motor Carrier authority" },
  { kind: "w9", label: "W-9 Form", hint: "For EIN and taxpayer classification" },
  { kind: "coi", label: "COI", hint: "Certificate of Insurance" },
  { kind: "noa", label: "NOA", hint: "Notice of assignment from factoring" },
  { kind: "voided-cheque", label: "Voided Cheque", hint: "For Quick Pay" },
];

export const ACCEPTED_MIME_TYPES: string[] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
];

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp";

export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB

export const MAX_DOCS = 10;
