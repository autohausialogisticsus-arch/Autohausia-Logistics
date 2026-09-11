import type { Metadata } from "next";
import CarrierApplicationForm from "@/components/CarrierApplicationForm";

export const metadata: Metadata = {
  title: "Carrier Application",
  description:
    "Apply for carrier dispatch support with Autohausia Logistic. Tell us about your equipment, lanes, and operating preferences and we will get back to you.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Carrier Application — Autohausia Dispatch",
    description:
      "Tell us about your equipment, lanes, and operating preferences. Submitting an application does not mean your carrier is approved.",
  },
};

export default function ApplyPage() {
  return (
    <main id="main" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          Carrier Application
        </span>
<h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
          Work With Autohausia Dispatch
        </h1>
        <p className="mt-4 text-slate">
          Tell us about your equipment and how you operate. Submitting this
          application does not mean your carrier is approved — Autohausia
          reviews every application and contacts qualified carriers about next
          steps.
        </p>
        <CarrierApplicationForm />
      </div>
    </main>
  );
}