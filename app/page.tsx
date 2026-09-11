import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import ServicesGrid from "@/components/ServicesGrid";
import HowItWorks from "@/components/HowItWorks";
import TrustMetrics from "@/components/TrustMetrics";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import IndustriesGrid from "@/components/IndustriesGrid";
import ContactForm from "@/components/ContactForm";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import { CONTACT_EMAIL, CONTACT_PHONE_TEL } from "@/lib/contact";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Freight Dispatch, Rates, and Paperwork Support | Autohausia Logistic LLC",
  description:
    "Autohausia dispatches flatbed, step deck, dry van, power only, box truck, and hotshot freight for owner-operators and small fleets — load matching, rate negotiation, and paperwork.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Keep Your Truck Moving — We'll Handle the Dispatch.",
    description:
      "Freight search, load matching, rate negotiation, and paperwork support for owner-operators and small fleets.",
  },
};

export default function Home() {
  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          email: CONTACT_EMAIL,
          telephone: CONTACT_PHONE_TEL,
        }}
      />
      <Hero />
      <div className="route-divider" aria-hidden="true" />
      <About />
      <WhyChooseUs />
      <ServicesGrid />
      <div className="route-divider" aria-hidden="true" />
      <HowItWorks />
      <TrustMetrics />
      <Testimonials />
      <FAQAccordion />
      <IndustriesGrid />
      <ContactForm />
      <FinalCta />
    </main>
  );
}
