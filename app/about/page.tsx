import type { Metadata } from "next";
import Link from "next/link";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About Autohausia Logistic",
  description:
    "Autohausia Logistic is a truck dispatch service for owner-operators and small fleets — load sourcing, rate negotiation, and paperwork support from a dedicated dispatcher.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Autohausia Logistic",
    description:
      "Dispatch support built around your truck — load sourcing, rate negotiation, paperwork, and clear communication.",
  },
};

export default function AboutPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            About
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            About Autohausia Logistic
          </h1>
          <p className="mt-4 max-w-2xl text-slate">
            A truck dispatch service for owner-operators and small fleets,
            handling the day-to-day desk work so your truck stays moving.
          </p>
        </div>
      </section>
      <About />
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 py-10">
          <Link
            href="/services"
            className="rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-steel"
          >
            View Dispatch Services
          </Link>
          <Link
            href="/apply"
            className="rounded-sm bg-amber px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Start Your Carrier Application
          </Link>
        </div>
      </section>
    </main>
  );
}