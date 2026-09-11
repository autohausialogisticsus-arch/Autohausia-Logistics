import type { Metadata } from "next";
import Link from "next/link";
import { AGREEMENT_SECTIONS, type AgreementSection } from "@/lib/carrierAgreement";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Carrier Dispatch Agreement",
  description:
    "Carrier dispatch agreement framework between Autohausia Logistic LLC and carriers. Legal terms pending review by qualified legal counsel.",
  alternates: { canonical: "/carrier-agreement" },
  robots: { index: false, follow: true },
};

export default function CarrierAgreementPage() {
  return (
    <main id="main" className="bg-fog py-16 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl px-6 print:max-w-none print:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
              Legal Document
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
              Carrier Dispatch Agreement
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate">
              Framework for the dispatch agreement between Autohausia Logistic
              LLC (the Dispatch Provider) and carriers. The actual legal terms
              must be drafted and approved by Autohausia Logistic and qualified
              legal counsel before this document is presented for execution.
            </p>
          </div>
          <p className="print:hidden">
            <PrintButton />
          </p>
        </div>

        <div className="mt-8 border-l-2 border-amber bg-amber/5 p-5 text-sm print:hidden">
          <p className="font-display text-base font-semibold text-ink">
            Framework only — legal terms pending
          </p>
          <p className="mt-2 leading-relaxed text-slate">
            No language on this page has been reviewed or approved by an
            attorney, and nothing here yet constitutes a binding agreement.
            Every section labeled{" "}
            <span className="font-semibold text-ink">Legal text pending</span>{" "}
            must be drafted by Autohausia Logistic and qualified legal counsel,
            then reviewed for accuracy. Keep this page clearly labeled until the
            finalized agreement is in place.
          </p>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-4 border border-line bg-white p-5 text-sm print:border-ink">
          <div className="grid md:grid-cols-2 md:gap-x-8">
            <dl className="space-y-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  Parties
                </dt>
                <dd className="mt-1 text-ink">
                  Autohausia Logistic LLC (Dispatch Provider) — Carrier
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  Effective Date
                </dt>
                <dd className="mt-1 text-ink">
                  Completed in the finalized, executed agreement
                </dd>
              </div>
            </dl>
            <dl className="space-y-3 md:mt-0">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  Status
                </dt>
                <dd className="mt-1">
                  <span className="inline-block border border-amber/60 bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber">
                    Framework — pending legal review
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">
                  Version
                </dt>
                <dd className="mt-1 text-ink">Draft — not for execution</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="mt-8 space-y-4" aria-label="Agreement sections">
          {AGREEMENT_SECTIONS.map((section: AgreementSection) => (
            <AgreementSectionCard key={section.id} section={section} />
          ))}
        </section>

        <div className="mt-10 flex flex-col items-start gap-4 border border-line bg-ink p-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Ready to get started?
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Apply for dispatch support. Approval of your application does not
              create or constitute this agreement.
            </p>
          </div>
          <Link
            href="/apply"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-amber px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Start Your Application
          </Link>
        </div>
      </div>
    </main>
  );
}

function AgreementSectionCard({ section }: { section: AgreementSection }) {
  if (section.structured) {
    return (
      <article className="border border-line bg-white p-6 print:break-inside-avoid print:border-ink print:p-4">
        <h2 className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-semibold text-amber">
            {section.number}
          </span>
          <span className="font-display text-lg font-semibold text-ink">
            {section.title}
          </span>
        </h2>
        <p className="mt-2 text-sm text-slate">{section.scope}</p>
        <div className="mt-4 space-y-5 border-t border-dashed border-line pt-4">
          {section.groups.map((group, index) => (
            <div key={group.groupLabel ?? index}>
              {group.groupLabel && (
                <p className="font-display text-sm font-semibold text-ink">
                  {group.groupLabel}
                </p>
              )}
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {group.fields.map((field) => (
                  <div key={field.label}>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-steel">
                      {field.label}
                    </span>
                    <div className="mt-1 border-b border-ink/40 pb-1 text-ink">
                      {field.placeholder}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {section.footnote && (
            <p className="text-xs text-slate">{section.footnote}</p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="border border-line bg-white p-6 print:break-inside-avoid print:border-ink print:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-semibold text-amber">
            {section.number}
          </span>
          <span className="font-display text-lg font-semibold text-ink">
            {section.title}
          </span>
        </h2>
        <span className="border border-amber/60 bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber">
          Legal text pending
        </span>
      </div>
      <p className="mt-2 text-sm text-slate">{section.scope}</p>
      <div className="mt-4 border-l-2 border-amber bg-fog p-4 print:bg-transparent print:p-0 print:pl-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber">
          Pending legal review — counsel draft required
        </p>
        <p className="mt-1 text-xs text-slate">{section.guidance}</p>
      </div>
    </article>
  );
}