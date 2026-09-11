"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

// PLACEHOLDER testimonials — names are illustrative and must be replaced with
// verified, consenting carriers before launch. Do not present these as real.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Autohausia has been a game-changer for my business. The loads keep coming and the paperwork is handled, so I can focus on driving.",
    name: "John D.",
    role: "Owner-Operator",
    rating: 5,
  },
  {
    quote:
      "Having a dedicated dispatcher who knows my lanes has made all the difference. I spend more time rolling and less time hunting for freight.",
    name: "Michael R.",
    role: "Small Fleet Owner",
    rating: 5,
  },
  {
    quote:
      "Every load comes to me for approval before anything is booked. That trust is why I stay with Autohausia.",
    name: "David K.",
    role: "Carrier",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span
      aria-label={`${count} out of 5 stars`}
      className="flex items-center justify-center gap-1 text-amber"
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="section-hairline bg-fog py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Driver Experiences
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            What Our Drivers Are Saying
          </h2>
          <p className="mt-4 text-base text-slate sm:text-base">
            Real experiences from carriers who trust Autohausia with their
            dispatch.
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl">
          <div
            className="rounded-xl border border-line bg-white p-8 text-center shadow-[0_1px_2px_rgba(11,18,32,0.05),0_16px_32px_-24px_rgba(11,18,32,0.25)] sm:p-12"
            aria-live="polite"
          >
            <Stars count={current.rating} />
            <blockquote className="mx-auto mt-6 max-w-2xl">
              <p className="text-lg leading-relaxed text-ink sm:text-xl">
                &ldquo;{current.quote}&rdquo;
              </p>
            </blockquote>
            <div className="mt-7">
              <p className="font-semibold text-ink">{current.name}</p>
              <p className="mt-0.5 text-sm text-slate">{current.role}</p>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-amber hover:text-amber"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h15" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>

            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Choose testimonial"
            >
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition ${
                    i === index ? "w-6 bg-amber" : "w-2.5 bg-slate/30 hover:bg-slate/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-amber hover:text-amber"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
