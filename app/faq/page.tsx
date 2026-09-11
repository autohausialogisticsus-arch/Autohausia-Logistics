import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Carrier Dispatch FAQs",
  description:
    "Answers about Autohausia carrier dispatch: equipment supported, load approval, rate negotiation, broker communication, dispatch fees, and how to apply.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Carrier Dispatch FAQs",
    description:
      "Equipment supported, load approval, rate negotiation, broker communication, and how to apply for dispatch support.",
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main id="main">
      <JsonLd data={faqSchema} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            FAQ
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            Carrier Dispatch FAQs
          </h1>
          <p className="mt-4 text-slate">
            Common questions about dispatching with Autohausia. If yours isn&apos;t
            here, contact a dispatcher.
          </p>
        </div>
      </section>
      <FAQAccordion />
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-4 px-6 py-10">
          <Link
            href="/apply"
            className="rounded-sm bg-amber px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Start Your Carrier Application
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:border-amber hover:text-amber"
          >
            Contact a Dispatcher
          </Link>
        </div>
      </section>
    </main>
  );
}