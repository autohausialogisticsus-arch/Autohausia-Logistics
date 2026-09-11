import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SERVICES } from "@/lib/services";
import ServicePage from "@/app/services/[slug]/page";

describe("Service detail pages", () => {
  for (const service of SERVICES) {
    it(`renders ${service.name} Dispatch page with schema and CTAs`, () => {
      const { container } = render(
        <ServicePage params={{ slug: `${service.slug}-dispatch` }} />
      );

      expect(
        screen.getByRole("heading", { level: 1, name: `${service.name} Dispatch` })
      ).toBeInTheDocument();
      expect(screen.getByText(service.summary)).toBeInTheDocument();
      for (const benefit of service.benefits) {
        expect(screen.getByText(benefit)).toBeInTheDocument();
      }

      const schemas = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(schemas.length).toBeGreaterThanOrEqual(2);
    const combined = schemas.map((s) => s.innerHTML).join("");
    expect(combined).toContain('"@type":"Service"');
    expect(combined).toContain(`"serviceType":"${service.name} Dispatch"`);
    expect(combined).toContain('"@type":"BreadcrumbList"');

      expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute("href", "/apply");
      expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact");
      expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    });
  }

  it("generates static params only for services actually offered", () => {
    const servicePage = require("@/app/services/[slug]/page");
    const paths = servicePage.generateStaticParams();
    const expected = SERVICES.map((s) => `${s.slug}-dispatch`);
    expect(paths.map((p: { slug: string }) => p.slug)).toEqual(expect.arrayContaining(expected));
    expect(paths.map((p: { slug: string }) => p.slug)).not.toContain("reefer-dispatch");
    expect(paths).toHaveLength(expected.length);
  });
});