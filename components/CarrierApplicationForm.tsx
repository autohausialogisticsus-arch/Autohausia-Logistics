"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { CheckIcon, UploadIcon, XIcon } from "@/components/icons";
import {
  type DocumentKind,
  DOCUMENT_KINDS,
  ACCEPT_ATTR,
  ACCEPTED_MIME_TYPES,
  MAX_DOC_BYTES,
} from "@/lib/documentTypes";

type DocUploadState = {
  status: "idle" | "uploading" | "uploaded" | "error";
  filename?: string;
  objectKey?: string;
  contentType?: string;
  size?: number;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[0-9+\s().-]*$/;
const MC_RE = /^(\d{4,8}|MC-?\d{4,8})$/i;
const USDOT_RE = /^\d{6,8}$/;

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "mcNumber"
  | "usdotNumber"
  | "equipmentType"
  | "truckCount"
  | "currentLocation";

type Errors = Partial<Record<FieldName, string>>;

function isValidPhone(value: string) {
  if (!PHONE_CHARS_RE.test(value)) return false;
  const digits = value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return digits.length >= 10 && digits.length <= 11;
}

function validate(values: Record<string, string>): Errors {
  const errors: Errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";
  if (!isValidPhone(values.phone)) errors.phone = "Enter a valid phone number.";
  if (!MC_RE.test(values.mcNumber.trim()))
    errors.mcNumber = "Enter a valid MC number (e.g. MC123456).";
  if (!USDOT_RE.test(values.usdotNumber.trim()))
    errors.usdotNumber = "Enter a valid USDOT number (6 to 8 digits).";
  if (!SERVICES.some((s) => s.slug === values.equipmentType))
    errors.equipmentType = "Select an equipment type.";
  if (!/^\d+$/.test(values.truckCount) || Number(values.truckCount) < 1)
    errors.truckCount = "Enter the number of trucks.";
  if (!values.currentLocation.trim())
    errors.currentLocation = "Current location is required.";
  return errors;
}

function inputClass(hasError: boolean) {
  return `min-w-0 w-full rounded-sm border bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate/60 focus:outline-none ${
    hasError ? "border-red-400 focus:border-red-500" : "border-line focus:border-amber"
  }`;
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {error}
    </p>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
        {title}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

export default function CarrierApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    "idle"
  );
  const [errors, setErrors] = useState<Errors>({});
  const [docs, setDocs] = useState<
    Partial<Record<DocumentKind, DocUploadState>>
  >({});
  const submittingRef = useRef(false);
  const fieldRefs = useRef<
    Partial<Record<FieldName, HTMLInputElement | HTMLSelectElement | null>>
  >({});

  function registerRef(name: FieldName) {
    return (el: HTMLInputElement | HTMLSelectElement | null) => {
      fieldRefs.current[name] = el;
    };
  }

  function setDoc(kind: DocumentKind, state: DocUploadState) {
    setDocs((prev) => ({ ...prev, [kind]: state }));
  }

  async function uploadDocument(kind: DocumentKind, file: File) {
    if (!file) return;
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setDoc(kind, {
        status: "error",
        message:
          "Unsupported file type. Use a PDF, JPG, PNG, HEIC, or WebP.",
      });
      return;
    }
    if (file.size > MAX_DOC_BYTES) {
      setDoc(kind, {
        status: "error",
        message: "File is larger than 10 MB. Please upload a smaller file.",
      });
      return;
    }

    const mcNumber = fieldRefs.current.mcNumber?.value.trim() ?? "";
    if (!mcNumber) {
      setDoc(kind, {
        status: "error",
        message: "Enter your MC Number above before uploading documents.",
      });
      return;
    }

    setDoc(kind, { status: "uploading", filename: file.name });

    try {
      const res = await fetch("/api/application/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          filename: file.name,
          contentType: file.type,
          size: file.size,
          mcNumber,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDoc(kind, {
          status: "error",
          message: data.error ?? "Could not prepare upload. Please try again.",
        });
        return;
      }
      const { url, key } = await res.json();

      const put = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setDoc(kind, {
          status: "error",
          message: "Upload failed. Please try again.",
        });
        return;
      }

      setDoc(kind, {
        status: "uploaded",
        filename: file.name,
        objectKey: key,
        contentType: file.type,
        size: file.size,
      });
    } catch {
      setDoc(kind, { status: "error", message: "Upload failed. Please try again." });
    }
  }

  function removeDocument(kind: DocumentKind) {
    setDoc(kind, { status: "idle" });
  }

  function clearError(name: FieldName) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    const values = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstErrorName = (Object.keys(nextErrors) as FieldName[])[0];
    if (firstErrorName) {
      fieldRefs.current[firstErrorName]?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      mcNumber: values.mcNumber.trim(),
      usdotNumber: values.usdotNumber.trim(),
      equipmentType: values.equipmentType,
      truckCount: Number(values.truckCount),
      currentLocation: values.currentLocation.trim(),
      preferredLanes: values.preferredLanes.trim(),
      preferredRegions: values.preferredRegions.trim(),
      homeTime: values.homeTime.trim(),
      message: values.message.trim(),
      smsOptIn: values.smsOptIn === "on",
      documents: DOCUMENT_KINDS.flatMap((d) => {
        const s = docs[d.kind];
        if (!s || s.status !== "uploaded" || !s.objectKey) return [];
        return [
          {
            kind: d.kind,
            objectKey: s.objectKey,
            filename: s.filename ?? "",
            contentType: s.contentType ?? "",
            size: s.size ?? 0,
          },
        ];
      }),
    };

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      submittingRef.current = false;
      setStatus("sent");
    } catch {
      submittingRef.current = false;
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-line bg-fog p-8 text-center"
      >
        <h2 className="font-display text-xl font-semibold text-ink">
          Application Received
        </h2>
        <p className="mt-3 text-sm text-slate">
          Thanks for applying. Your application has been received and
          Autohausia will review it and contact you about next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
      <p className="text-xs text-slate">
        Fields marked with <span className="text-amber">*</span> are required.
        Submitting this application does not mean your carrier is approved.
      </p>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-ink">
              First Name <span className="text-amber">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              ref={registerRef("firstName")}
              autoComplete="given-name"
              onChange={() => clearError("firstName")}
              aria-invalid={errors.firstName ? true : undefined}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={inputClass(Boolean(errors.firstName))}
            />
            <FieldError id="firstName-error" error={errors.firstName} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-ink">
              Last Name <span className="text-amber">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              ref={registerRef("lastName")}
              autoComplete="family-name"
              onChange={() => clearError("lastName")}
              aria-invalid={errors.lastName ? true : undefined}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={inputClass(Boolean(errors.lastName))}
            />
            <FieldError id="lastName-error" error={errors.lastName} />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-ink">
            Company Name
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass(false)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email <span className="text-amber">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              ref={registerRef("email")}
              autoComplete="email"
              onChange={() => clearError("email")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
            />
            <FieldError id="email-error" error={errors.email} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink">
              Phone <span className="text-amber">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              ref={registerRef("phone")}
              autoComplete="tel"
              onChange={() => clearError("phone")}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClass(Boolean(errors.phone))}
            />
            <FieldError id="phone-error" error={errors.phone} />
          </div>
        </div>
      </Section>

      <Section title="Carrier Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mcNumber" className="block text-sm font-medium text-ink">
              MC Number <span className="text-amber">*</span>
            </label>
            <input
              id="mcNumber"
              name="mcNumber"
              type="text"
              ref={registerRef("mcNumber")}
              onChange={() => clearError("mcNumber")}
              aria-invalid={errors.mcNumber ? true : undefined}
              aria-describedby={errors.mcNumber ? "mcNumber-error" : undefined}
              className={inputClass(Boolean(errors.mcNumber))}
            />
            <FieldError id="mcNumber-error" error={errors.mcNumber} />
          </div>
          <div>
            <label htmlFor="usdotNumber" className="block text-sm font-medium text-ink">
              USDOT Number <span className="text-amber">*</span>
            </label>
            <input
              id="usdotNumber"
              name="usdotNumber"
              type="text"
              ref={registerRef("usdotNumber")}
              onChange={() => clearError("usdotNumber")}
              aria-invalid={errors.usdotNumber ? true : undefined}
              aria-describedby={errors.usdotNumber ? "usdotNumber-error" : undefined}
              className={inputClass(Boolean(errors.usdotNumber))}
            />
            <FieldError id="usdotNumber-error" error={errors.usdotNumber} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="equipmentType" className="block text-sm font-medium text-ink">
              Equipment Type <span className="text-amber">*</span>
            </label>
            <select
              id="equipmentType"
              name="equipmentType"
              defaultValue=""
              ref={registerRef("equipmentType")}
              onChange={() => clearError("equipmentType")}
              aria-invalid={errors.equipmentType ? true : undefined}
              aria-describedby={errors.equipmentType ? "equipmentType-error" : undefined}
              className={inputClass(Boolean(errors.equipmentType))}
            >
              <option value="" disabled>
                Select equipment type
              </option>
              {SERVICES.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </select>
            <FieldError id="equipmentType-error" error={errors.equipmentType} />
          </div>
          <div>
            <label htmlFor="truckCount" className="block text-sm font-medium text-ink">
              Number of Trucks <span className="text-amber">*</span>
            </label>
            <input
              id="truckCount"
              name="truckCount"
              type="number"
              min={1}
              inputMode="numeric"
              ref={registerRef("truckCount")}
              onChange={() => clearError("truckCount")}
              aria-invalid={errors.truckCount ? true : undefined}
              aria-describedby={errors.truckCount ? "truckCount-error" : undefined}
              className={inputClass(Boolean(errors.truckCount))}
            />
            <FieldError id="truckCount-error" error={errors.truckCount} />
          </div>
        </div>
      </Section>

      <Section title="Required Documents">
        <p className="text-sm text-slate">
          Attach the documents below to help us verify your carrier. These are
          optional at submission — you can add them now or email them to us
          later — but carriers with documents on file onboard faster.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOCUMENT_KINDS.map((doc) => (
            <DocumentUpload
              key={doc.kind}
              label={doc.label}
              hint={doc.hint}
              state={docs[doc.kind] ?? { status: "idle" }}
              onChange={(file) => uploadDocument(doc.kind, file)}
              onRemove={() => removeDocument(doc.kind)}
            />
          ))}
        </div>
      </Section>

      <Section title="Operations">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="currentLocation" className="block text-sm font-medium text-ink">
              Current Location <span className="text-amber">*</span>
            </label>
            <input
              id="currentLocation"
              name="currentLocation"
              type="text"
              ref={registerRef("currentLocation")}
              onChange={() => clearError("currentLocation")}
              aria-invalid={errors.currentLocation ? true : undefined}
              aria-describedby={errors.currentLocation ? "currentLocation-error" : undefined}
              className={inputClass(Boolean(errors.currentLocation))}
            />
            <FieldError id="currentLocation-error" error={errors.currentLocation} />
          </div>
          <div>
            <label htmlFor="preferredLanes" className="block text-sm font-medium text-ink">
              Preferred Lanes
            </label>
            <input
              id="preferredLanes"
              name="preferredLanes"
              type="text"
              placeholder="e.g. Midwest to Southeast"
              className={inputClass(false)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="preferredRegions" className="block text-sm font-medium text-ink">
              Preferred States/Regions
            </label>
            <input
              id="preferredRegions"
              name="preferredRegions"
              type="text"
              className={inputClass(false)}
            />
          </div>
          <div>
            <label htmlFor="homeTime" className="block text-sm font-medium text-ink">
              Home Time / Operating Preferences
            </label>
            <input
              id="homeTime"
              name="homeTime"
              type="text"
              placeholder="e.g. home weekly, 1,200 miles/week"
              className={inputClass(false)}
            />
          </div>
        </div>
      </Section>

      <Section title="Additional Information">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-ink">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClass(false)}
          />
        </div>
      </Section>

      <Section title="Communication Consent">
        <label className="flex items-start gap-3 text-sm text-slate">
          <input
            type="checkbox"
            name="smsOptIn"
            className="mt-0.5"
            aria-describedby="sms-consent-note"
          />
          <span>
            I agree to receive SMS updates about my application and loads from
            Autohausia Logistic LLC. Message and data rates may apply. Reply
            STOP to opt out.
          </span>
        </label>
        <p id="sms-consent-note" className="text-xs text-slate">
          SMS consent is optional and separate from your application. You can
          apply without it. For details on how we use your information, see our{" "}
          <Link href="/privacy" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
            Terms of Service
          </Link>
          .
        </p>
      </Section>

      {status === "error" && (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Something went wrong — your application was not submitted. Please try
          again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-sm bg-amber px-8 py-3.5 font-semibold text-ink transition hover:bg-amber/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function DocumentUpload({
  label,
  hint,
  state,
  onChange,
  onRemove,
}: {
  label: string;
  hint: string;
  state: DocUploadState;
  onChange: (file: File) => void;
  onRemove: () => void;
}) {
  const inputId = `doc-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div
      className={`rounded-sm border bg-white p-4 transition ${
        state.status === "error"
          ? "border-red-400"
          : state.status === "uploaded"
          ? "border-green-400"
          : "border-dashed border-line"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-slate">{hint}</p>
        </div>
        {state.status === "idle" && (
          <label
            htmlFor={inputId}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border border-line bg-fog px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-amber hover:text-amber"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            Upload
          </label>
        )}
        {state.status === "uploading" && (
          <span className="shrink-0 text-xs font-medium text-slate" role="status">
            Uploading…
          </span>
        )}
        {state.status === "uploaded" && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-green-600">
            <CheckIcon className="h-4 w-4" />
            Added
          </span>
        )}
        {state.status === "error" && (
          <span className="shrink-0 text-xs font-medium text-red-500">
            Failed
          </span>
        )}
      </div>

      {state.status === "idle" && (
        <input
          id={inputId}
          type="file"
          accept={ACCEPT_ATTR}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
            e.currentTarget.value = "";
          }}
        />
      )}

      {(state.status === "uploading" || state.status === "uploaded") &&
        state.filename && (
          <p className="mt-2 truncate text-xs text-slate">
            {state.status === "uploaded" ? state.filename : `Uploading ${state.filename}`}
          </p>
        )}

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {state.message}
        </p>
      )}

      {state.status === "uploaded" && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate transition hover:text-red-600"
        >
          <XIcon className="h-3.5 w-3.5" />
          Remove
        </button>
      )}
    </div>
  );
}