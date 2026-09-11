import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { ChatIcon, DocIcon, PhoneIcon, MailIcon, TruckIcon } from "@/components/icons";
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Autohausia Logistic's dispatch team about freight search, load matching, rate negotiation, and paperwork support for your truck or fleet.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Autohausia Logistic Dispatch",
    description:
      "Reach the Autohausia dispatch team by phone or email, or use the carrier application.",
  },
};

export default function ContactPage() {
  return (
    <main id="main" className="bg-fog py-16">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Contact
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            Talk to a Dispatcher
          </h1>
          <p className="mt-4 text-slate">
            Reach the Autohausia dispatch team about your equipment, lanes, and
            availability — or skip straight to the carrier application.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <InfoCard
              icon={<PhoneIcon className="h-5 w-5" />}
              title="Phone"
              body={
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-ink underline-offset-4 transition hover:text-amber hover:underline"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              }
            />
            <InfoCard
              icon={<MailIcon className="h-5 w-5" />}
              title="Email"
              body={
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="break-all text-ink underline-offset-4 transition hover:text-amber hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              }
            />
            <InfoCard
              icon={<TruckIcon className="h-5 w-5" />}
              title="Business Information"
              body={
                <>
                  <p>{COMPANY_NAME}</p>
                  <p className="mt-1 text-xs text-slate">
                    Freight dispatch for owner-operators and small fleets —
                    flatbed, dry van, step deck, power only, box truck, and
                    hotshot.
                  </p>
                </>
              }
            />
            <InfoCard
              icon={<DocIcon className="h-5 w-5" />}
              title="Carrier Application"
              body={
                <>
                  <p className="text-sm text-slate">
                    Ready to work with Autohausia?
                  </p>
                  <Link
                    href="/apply"
                    className="mt-3 inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-steel"
                  >
                    Start Your Carrier Application
                  </Link>
                </>
              }
            />
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <ChatIcon className="h-5 w-5 text-amber" />
              <h2 className="font-display text-xl font-semibold text-ink">
                Send a Message
              </h2>
            </div>
            <ContactForm embedded />
            <p className="mt-4 text-xs text-slate">
              Submitting this form does not approve your carrier. Autohausia
              reviews every inquiry and responds to qualified carriers about
              next steps.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-sm border border-line bg-white p-5 shadow-[0_1px_2px_rgba(11,18,32,0.06),0_12px_24px_-16px_rgba(11,18,32,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(11,18,32,0.08),0_20px_36px_-18px_rgba(11,18,32,0.4)]">
      <div className="flex items-center gap-2 text-amber">
        {icon}
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-ink">
          {title}
        </h2>
      </div>
      <div className="mt-2 flex-1 text-sm">{body}</div>
    </div>
  );
}