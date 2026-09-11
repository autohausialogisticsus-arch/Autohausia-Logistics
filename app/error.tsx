"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="bg-fog py-24">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          Error 500
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Caught in a breakdown.
        </h1>
        <p className="mt-4 text-slate">
          Something went wrong on our end. Try again, and if it keeps happening
          reach out — we&apos;ll get you moving again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-steel"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-sm border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:border-amber hover:text-amber"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="rounded-sm bg-amber px-6 py-3 text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}