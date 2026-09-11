import type { Metadata } from "next";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";

export const metadata: Metadata = {
  title: "Why Carriers Choose Autohausia Dispatch",
  description:
    "Carrier-focused dispatch: load matching to your equipment and lanes, rate negotiation with brokers, one dedicated dispatcher, and paperwork handled before you roll.",
  alternates: { canonical: "/why-choose-us" },
  openGraph: {
    title: "Why Carriers Choose Autohausia Dispatch",
    description:
      "Load matching, rate negotiation, dedicated communication, and paperwork support built around your truck.",
  },
};

export default function WhyChooseUsPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Why Autohausia
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            Why Carriers Choose Autohausia
          </h1>
          <p className="mt-4 max-w-2xl text-slate">
            Dispatch built around your equipment, your lanes, and your rate
            floor — with every load coming to you for approval before it is
            booked.
          </p>
        </div>
      </section>
      <WhyChooseUs />
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 py-10">
          <Link
            href="/services"
            className="rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-steel"
          >
            View Dispatch Services
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:border-amber hover:text-amber"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}