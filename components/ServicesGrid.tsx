import { SERVICES } from "@/lib/services";
import ImageCard from "@/components/ui/ImageCard";
import { ArrowRightIcon } from "@/components/icons";

export default function ServicesGrid({ showAllLink = true }: { showAllLink?: boolean }) {
  return (
    <section id="services" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Dispatch Services
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            Freight We Dispatch
          </h2>
          <p className="mt-4 text-base text-slate">
            We build dispatch around your operation: your equipment type, where
            you run, and how you like to work. Share your location, preferred
            lanes, availability, and carrier preferences, and we match loads and
            handle the paperwork around that setup.
          </p>
          {showAllLink && (
            <a
              href="/services"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-amber"
            >
              See all dispatch services
              <ArrowRightIcon className="h-4 w-4 text-amber" />
            </a>
          )}
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((service) => (
            <ImageCard
              key={service.slug}
              src={`/images/services/${service.image}`}
              alt={`${service.name} truck transportation service`}
              title={service.name}
              subtitle={service.summary}
              ctaText="Learn More"
              ctaHref={`/services/${service.slug}-dispatch`}
            />
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center rounded-lg bg-ink px-6 py-12 text-center sm:px-8 sm:py-14">
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            Find the Right Dispatch Support
          </h3>
          <p className="mt-3 max-w-xl text-sm text-fog/70 sm:text-base">
            Tell a dispatcher about your equipment, lanes, and availability and
            we will take it from there.
          </p>
          <a
            href="/apply"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-8 py-4 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-amber/90"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}