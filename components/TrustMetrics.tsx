import Image from "next/image";
import AnimatedCounter from "@/components/AnimatedCounter";

export type TrustMetric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

// ORDER MATTERS: only the three requested metrics.
// These are PLACEHOLDERS from the product reference — replace with
// verified Autohausia figures once actual business data is available.
// Do not present these as confirmed statistics.
const METRICS: TrustMetric[] = [
  { value: 5000, label: "Happy Customers" },
  { value: 7500, prefix: "$", label: "Avg Gross per Week" },
  { value: 500, label: "Happy Clients" },
];

export default function TrustMetrics() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/truck-sunset.png"
        alt="Semi truck driving on a highway at dusk, representing reliable freight dispatch"
        width={2880}
        height={1620}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(11,18,32,0.82)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/70"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Results That Matter
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Built Around Your Success
          </h2>
          <p className="mt-4 text-base text-white/70 sm:text-base">
            We measure our work by what it does for your operation — keeping
            your equipment full, your paperwork handled, and your business
            moving.
          </p>
        </header>

        <dl className="mt-12 grid grid-cols-1 gap-10 sm:mt-14 lg:mt-16 lg:grid-cols-3 lg:gap-0">
          {METRICS.map((metric, index) => (
            <div
              key={metric.label}
              className={`text-center lg:px-8 ${
                index > 0 ? "lg:border-l lg:border-white/15" : ""
              }`}
            >
              <dt className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                <AnimatedCounter
                  target={metric.value}
                  prefix={metric.prefix ?? ""}
                  suffix="+"
                />
              </dt>
              <dd className="mt-2 font-mono text-xs uppercase tracking-widest text-white/60">
                {metric.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
