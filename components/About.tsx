import Image from "next/image";
import { SearchIcon, PriceTagIcon, DocIcon, ChatIcon } from "@/components/icons";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-14 sm:py-20">
      {/* Full-width background image */}
      <Image
        src="/images/trucks/About section.jpg"
        alt="Semi truck on the road symbolizing Autohausia's freight dispatch services"
        fill
        sizes="100vw"
        priority={false}
        className="object-cover object-center"
      />
      {/* Dark semi-transparent overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(11,18,32,0.85)]"
      />

      <div className="relative mx-auto max-w-7xl grid grid-cols-1 items-start gap-8 px-6 lg:grid-cols-2 lg:gap-12">
        <div className="lg:w-1/2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            About Autohausia
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Dispatch support built around your truck
          </h2>
          <p className="mt-6 text-white/85 sm:mb-6">
            Autohausia is a truck dispatch service for owner-operators and small
            fleets. We take on the day-to-day work of finding freight and
            managing loads, so your truck stays moving and your focus stays on
            the road.
          </p>
          <p className="text-white/85">
            You work with a dedicated dispatcher who learns your equipment and
            the lanes you run. When a load fits your setup, it comes to you for
            approval before anything is booked. From there we coordinate pickup
            and delivery and handle the paperwork, so you can roll with
            confidence.
          </p>
        </div>

        <div className="lg:w-1/2 space-y-8">
          <h3 className="font-display text-lg font-semibold text-white">
            What we handle on your side
          </h3>
          <ul className="mt-6 space-y-6">
            <li className="flex gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-amber/20 text-amber">
                <SearchIcon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-white">Load Sourcing</h4>
                <p className="mt-1 text-sm text-white/85">
                  We search for freight that fits your equipment and the lanes you prefer to run.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-amber/20 text-amber">
                <PriceTagIcon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-white">Rate Negotiation</h4>
                <p className="mt-1 text-sm text-white/85">
                  We work the rate with brokers so every load you take has a firm number attached.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-amber/20 text-amber">
                <DocIcon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-white">Paperwork Support</h4>
                <p className="mt-1 text-sm text-white/85">
                  Rate confirmations, BOLs, and load documents are reviewed before you roll.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-amber/20 text-amber">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-white">Clear Communication</h4>
                <p className="mt-1 text-sm text-white/85">
                  One dedicated dispatcher who knows your setup, from pickup through delivery.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-sm bg-amber px-7 py-4 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-amber/90"
            >
              Get Started
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 mr-2 -mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
