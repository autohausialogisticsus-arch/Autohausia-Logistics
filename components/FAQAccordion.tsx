import { FAQS } from "@/lib/faqs";

export default function FAQAccordion() {
  return (
    <section id="faq" className="section-hairline bg-fog py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <span className="block text-center font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          FAQ
        </span>
        <h2 className="mt-3 text-center font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
          Frequently Asked Questions
        </h2>
        <ul className="mt-8 space-y-3 sm:mt-10">
          {FAQS.map((item) => (
            <li key={item.q} className="border border-line bg-white">
              <details className="group">
                <summary className="flex min-h-12 w-full cursor-pointer select-none items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-fog/60 sm:px-5 sm:py-4">
                  <h3 className="font-display text-sm font-semibold text-ink sm:text-base">
                    {item.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl leading-none text-amber transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-line px-4 pb-5 pt-3 sm:px-5">
                  <p className="text-sm text-slate">{item.a}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}