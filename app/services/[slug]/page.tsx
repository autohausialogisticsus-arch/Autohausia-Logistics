import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SERVICES, type Service } from "@/lib/services";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: `${service.slug}-dispatch`,
  }));
}

function findService(slug: string): Service | undefined {
  return SERVICES.find((service) => `${service.slug}-dispatch` === slug);
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = findService(params.slug);
  if (!service) return {};
  return {
    title: `${service.name} Dispatch`,
    description: `${service.summary} Autohausia matches ${service.name.toLowerCase()} freight to your equipment, negotiates the rate when authorized, and handles the dispatch paperwork.`,
    alternates: { canonical: `/services/${params.slug}` },
    openGraph: {
      title: `${service.name} Dispatch Services`,
      description: service.summary,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = findService(params.slug);
  if (!service) notFound();

  const canonical = absoluteUrl(`/services/${params.slug}`);

  return (
    <main id="main" className="bg-fog">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": canonical,
          name: `${service.name} Dispatch`,
          serviceType: `${service.name} Dispatch`,
          description: service.summary + " " + service.description,
          provider: {
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", url: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Dispatch Services", url: absoluteUrl("/services") },
            { "@type": "ListItem", position: 3, name: `${service.name} Dispatch`, url: canonical },
          ],
        }}
      />

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-widest text-steel">
            <ol className="flex flex-wrap gap-1">
              <li>
                <Link href="/" className="transition hover:text-amber">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="transition hover:text-amber">Services</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-amber">
                {service.name} Dispatch
              </li>
            </ol>
          </nav>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-5xl">
            {service.name} Dispatch
          </h1>
          <p className="mt-4 max-w-2xl text-slate">{service.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-amber/90"
            >
              Get Started
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-amber hover:text-amber"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              About {service.name} Dispatch
            </h2>
            <p className="mt-4 text-slate">{service.description}</p>
          </div>
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              What&apos;s included
            </h2>
            <ul className="mt-4 space-y-3">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                  <span className="text-sm text-slate">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="font-display text-xl font-semibold text-ink">
            Other equipment we dispatch
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICES.filter((other) => other.slug !== service.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}-dispatch`}
                  className="flex items-center justify-between rounded-sm border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-amber hover:text-amber"
                >
                  {other.name}
                  <ArrowRightIcon className="h-4 w-4 text-amber" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate">
              Not sure which setup fits? Talk it through with a dispatcher.
            </p>
            <Link
              href="/apply"
              className="shrink-0 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-steel"
            >
              Start Your Carrier Application
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}