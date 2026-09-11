import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Autohausia Logistic collects, uses, and protects your personal information when you contact us or apply for carrier dispatch support.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-14 text-slate sm:py-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
        Legal
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate">Last updated: September 2, 2026</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            1. Who We Are
          </h2>
          <p className="mt-2">
            This website is operated by Autohausia Logistic. This Privacy
            Policy explains what personal information we collect through this
            website, how we use it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            2. Information We Collect
          </h2>
          <p className="mt-2">We collect information you choose to provide to us, including:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Contact form:</strong> your name,
              email address, phone number, and the contents of your message.
            </li>
            <li>
              <strong className="text-ink">Carrier application:</strong> your
              first and last name, email address, phone number, MC number,
              USDOT number, equipment type, truck count, and current location.
            </li>
            <li>
              <strong className="text-ink">Optional consent:</strong> your
              choice to receive SMS load updates and/or trucking industry
              newsletters.
            </li>
          </ul>
          <p className="mt-3">
            When you contact us, we may also automatically collect limited
            technical data (such as your IP address and browser type) to help
            keep the site secure and to diagnose technical issues.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            3. How We Use Your Information
          </h2>
          <p className="mt-2">We use the information you provide to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Respond to your inquiries and provide dispatch services.</li>
            <li>Review and process carrier applications.</li>
            <li>Send SMS updates about your loads, if you opted in.</li>
            <li>
              Send newsletters and industry news, if you subscribed (you can
              unsubscribe at any time).
            </li>
            <li>Meet legal, regulatory, and security obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            4. SMS Consent
          </h2>
          <p className="mt-2">
            Where you provide consent, we may send SMS messages about your
            loads. Message and data rates may apply. You can opt out at any
            time by replying STOP to any message. We do not share your
            wireless number with third parties for their own marketing
            purposes. Consent to receive SMS is not a condition of purchasing
            any service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            5. How We Share Information
          </h2>
          <p className="mt-2">
            We do not sell your personal information. We share information only
            as needed to provide our services or as required by law, such as:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              With service providers who help us operate the website and
              communicate with you (for example, email or SMS delivery
              services), under agreements that require them to protect your
              data.
            </li>
            <li>
              With relevant parties as part of arranging and coordinating your
              freight, where necessary to provide the services you requested.
            </li>
            <li>
              With authorities, courts, or regulators where we are legally
              required to do so.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            6. Data Retention
          </h2>
          <p className="mt-2">
            We keep your information only as long as reasonably necessary for
            the purposes described in this policy, to manage your account and
            applications, and to meet legal or regulatory requirements.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            7. Your Rights
          </h2>
          <p className="mt-2">
            Depending on where you live, you may have rights to access,
            correct, delete, or restrict the use of your personal information,
            and to object to certain processing. To exercise any of these
            rights, or to ask a question about this policy, contact us using
            the details below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            8. Contact Us
          </h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy or want to request
            access to, correction of, or deletion of your information, please
            contact us through our contact form at{" "}
            <a href="/contact" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
              /contact
            </a>{" "}
            or email the address provided on that page.
          </p>
        </section>
      </div>
    </main>
  );
}
