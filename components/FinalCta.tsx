import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

const SUPPORT_ITEMS = [
  "Freight Search",
  "Load Matching",
  "Rate Negotiation",
  "Dispatch Coordination",
  "Paperwork Support",
];

export default function FinalCta() {
  return (
    <section id="get-started" className="relative overflow-hidden bg-ink text-white">
      {/* Full-width background image */}
      <Image
        src="/images/trucks/ready-when-you-are.png"
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

      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
        <span className="inline-block rounded-sm bg-amber/10 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-amber">
          Ready When You Are
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Keep Your Truck Moving?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-base">
          Autohausia can help with freight search, load matching, rate
          negotiation, dispatch coordination, and paperwork support — so you can
          spend your time behind the wheel, not behind the desk.
        </p>
        <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2 sm:mt-8">
          {SUPPORT_ITEMS.map((item) => (
            <li
              key={item}
              className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/85 sm:text-xs"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/apply"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 font-semibold uppercase tracking-wide text-ink transition hover:bg-white sm:mt-10 sm:px-8"
        >
          Start Your Carrier Application
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
