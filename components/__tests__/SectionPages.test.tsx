import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ServicesPage from "@/app/services/page";
import AboutPage from "@/app/about/page";
import WhyChooseUsPage from "@/app/why-choose-us/page";
import FaqPage from "@/app/faq/page";

describe("SEO section pages", () => {
  it("/services has a single h1 and lists every service with detail links", () => {
    const { container } = render(<ServicesPage />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe("Dispatch Services");
    const faqSchema = container.querySelector('script[type="application/ld+json"]');
    expect(faqSchema).not.toBeNull();
    expect(faqSchema!.innerHTML).toContain('"@type":"ItemList"');
    const learnMoreLinks = screen.getAllByRole("link", { name: /^Learn More about/ });
    expect(learnMoreLinks).toHaveLength(6);
    expect(learnMoreLinks[0]).toHaveAttribute("href", "/services/flatbed-dispatch");
    expect(learnMoreLinks.at(-1)).toHaveAttribute("href", "/services/hotshot-dispatch");
  });

  it("/about, /why-choose-us, and /faq each have one h1 and canonical-friendly headings", () => {
    const rendering = [
      <>
        <AboutPage />
      </>,
      <>
        <WhyChooseUsPage />
      </>,
      <>
        <FaqPage />
      </>,
    ];
    for (const page of rendering) {
      const { container } = render(page);
      expect(container.querySelectorAll("h1").length).toBe(1);
    }
  });

  it("/faq emits FAQPage schema with each question and answer", () => {
    const { container } = render(<FaqPage />);
    const schema = container.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    const html = schema!.innerHTML;
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"Question"');
    expect(html).toContain("What equipment do you dispatch?");
  });
});