import Link from "next/link";
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Carrier Application", href: "/apply" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Carrier Agreement", href: "/carrier-agreement" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink text-white/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-20">
        <div>
          <Link
            href="/"
            aria-label="AUTOHAUSIA LOGISTIC LLC"
            className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-white transition hover:text-amber"
          >
            Autohausia
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Freight dispatch for owner-operators and small fleets — flatbed,
            step deck, dry van, power only, box truck, and hotshot.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Navigation
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block transition hover:text-amber"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Legal
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block transition hover:text-amber"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Contact
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="inline-block transition hover:text-amber"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="break-all">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block transition hover:text-amber"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row sm:px-8">
          <p>
            © {year} {COMPANY_NAME}. All rights reserved.
          </p>
          <p className="text-white/40">
            Dispatch partner for owner-operators &amp; small fleets.
          </p>
        </div>
      </div>
    </footer>
  );
}