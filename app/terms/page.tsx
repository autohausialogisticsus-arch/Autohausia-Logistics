import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing the use of the Autohausia Logistic website and our dispatch services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-14 text-slate sm:py-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
        Legal
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-slate">Last updated: September 2, 2026</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By accessing or using this website, you agree to be bound by these
            Terms of Service and our Privacy Policy. If you do not agree, please
            do not use the website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            2. Nature of Our Services
          </h2>
          <p className="mt-2">
            The information on this website describes truck dispatch and related
            transportation services offered by Autohausia Logistic. Nothing on
            this site constitutes a binding offer or a contract for services.
            Specific terms for any services you request will be agreed between
            you and Autohausia Logistic separately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            3. Carrier Applications
          </h2>
          <p className="mt-2">
            Submitting a carrier application through this website does not mean
            your carrier is approved. Autohausia Logistic reviews every
            application and contacts qualified carriers about next steps. We
            reserve the right to accept or decline any application in our
            discretion.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            4. Accuracy of Information
          </h2>
          <p className="mt-2">
            We work to keep the information on this website accurate and
            current, but we do not warrant that it is complete, accurate, or
            free of errors. Information is provided on an &ldquo;as is&rdquo;
            and &ldquo;as available&rdquo; basis without warranties of any
            kind, whether express or implied.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            5. Acceptable Use
          </h2>
          <p className="mt-2">
            You agree not to misuse this website, including by attempting to
            gain unauthorized access, disrupting its operation, submitting
            false or misleading information, or using the site in any way that
            violates applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            6. Limitation of Liability
          </h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Autohausia Logistic shall
            not be liable for any indirect, incidental, special, or
            consequential damages arising out of or in connection with your use
            of this website. Nothing in these terms limits liability that
            cannot be limited by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            7. Changes to These Terms
          </h2>
          <p className="mt-2">
            We may update these Terms of Service from time to time. The most
            current version will always be posted on this page, and the
            &ldquo;Last updated&rdquo; date above will reflect the most recent
            change.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            8. Contact
          </h2>
          <p className="mt-2">
            If you have questions about these Terms of Service, please contact
            us through our contact form at{" "}
            <a href="/contact" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
              /contact
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
