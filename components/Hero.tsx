"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

const SLIDES = [
  {
    src: "/images/trucks/box-truck.png",
    alt: "Box truck on the road representing Autohausia's freight dispatch services",
  },
  {
    src: "/images/trucks/reffer.png",
    alt: "Refrigerated truck on the road representing Autohausia's freight dispatch services",
  },
  {
    src: "/images/trucks/flatbed.png",
    alt: "Flatbed truck on the road representing Autohausia's freight dispatch services",
  },
];

const SERVICE_CHIPS = [
  "Freight Search",
  "Load Matching",
  "Rate Negotiation",
  "Dispatch Coordination",
  "Paperwork Support",
];

const SLIDE_INTERVAL_MS = 3000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const count = SLIDES.length;

  // Auto-advance the slideshow. The timer keeps running so the loop
  // continues indefinitely, even after manual selection.
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count]);

  const select = (index: number) => {
    setActive(index);
  };

  return (
    <section
      className="relative flex min-h-[600px] flex-col overflow-hidden md:min-h-[660px] lg:min-h-[720px]"
      style={{ background: "rgba(11, 18, 32, 0.7)" }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Truck dispatch service imagery"
    >
      {/* Background image slides — full-bleed, cross-fading. */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <Image
              key={slide.src}
              src={slide.src}
              alt={isActive ? slide.alt : ""}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition: i === 2 ? "center 60%" : "center 40%" }}
            />
          );
        })}
      </div>

      {/* Dark gradient overlay — darker on the left where text sits, lighter
          on the right so the truck photography stays clearly visible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,18,32,0.9) 0%, rgba(11,18,32,0.72) 45%, rgba(11,18,32,0.3) 78%, rgba(11,18,32,0.12) 100%)",
        }}
      />
      {/* Vertical fade to ground the hero against the page below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(to top, rgba(11,18,32,0.5), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-6 px-6 py-20 sm:px-8 md:py-24 lg:flex-row lg:items-center lg:gap-10">
        <div className="max-w-xl">
          <span className="mb-4 inline-block w-fit rounded-sm bg-amber/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-amber">
            Truck Dispatch Services
          </span>
          <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Keep Your Truck Moving.
            <br className="hidden sm:block" />
            <span className="text-amber">We&apos;ll Handle the Dispatch.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Autohausia pairs owner-operators and small fleets with the right
            freight, negotiates rates in your lanes, coordinates every load
            from pickup to delivery, and handles the dispatch paperwork — so
            you can stay on the road.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
            <a
              href="/apply"
              className="inline-flex items-center justify-center rounded-sm bg-amber px-7 py-4 text-center font-semibold uppercase tracking-wide text-ink transition hover:bg-amber/90"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-white/30 px-7 py-4 text-center font-semibold uppercase tracking-wide text-white transition hover:border-amber hover:text-amber"
            >
              Contact Us
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2 md:mt-9">
            {SERVICE_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/70"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Arrow controls — subtle, at the vertical edges of the content. */}
      <button
        type="button"
        onClick={() => select((active - 1 + count) % count)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white/80 backdrop-blur-sm transition hover:border-amber hover:text-amber"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => select((active + 1) % count)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white/80 backdrop-blur-sm transition hover:border-amber hover:text-amber"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators — minimal, clickable. */}
      <div
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:left-auto sm:right-8 sm:translate-x-0 lg:bottom-8"
        role="group"
        aria-label="Choose hero slide"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => select(i)}
            aria-label={`Show slide ${i + 1} of ${count}`}
            aria-current={i === active ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-amber"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
