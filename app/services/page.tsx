import type { Metadata } from "next";
import ServicesGrid from "@/components/ServicesGrid";
import JsonLd from "@/components/JsonLd";
import { SERVICES } from "@/lib/services";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dispatch Services for Owner-Operators and Small Fleets",
  description:
    "Dispatch support for flatbed, step deck, dry van, power only, box truck, and hotshot operations — load matching, rate negotiation, and paperwork from one dispatcher.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Dispatch Services for Owner-Operators and Small Fleets",
    description:
      "Load matching, rate negotiation, and paperwork for six equipment types.",
  },
};

export default function ServicesPage() {
  const itemList = SERVICES.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.name,
    url: absoluteUrl(`/services/${service.slug}-dispatch`),
  }));

  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Dispatch Services",
          itemListElement: itemList,
        }}
      />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Dispatch Services
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            Dispatch Services
          </h1>
          <p className="mt-4 max-w-2xl text-slate">
            Autohausia handles the desk work for the equipment you actually run.
            Explore each setup below, then talk to a dispatcher or start your
            carrier application.
          </p>
        </div>
      </section>
      <ServicesGrid showAllLink={false} />
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <p className="text-center text-xs text-slate">
          {SITE_NAME} dispatches {SERVICES.map((s) => s.name).join(", ")}.
        </p>
      </div>
    </main>
  );
}