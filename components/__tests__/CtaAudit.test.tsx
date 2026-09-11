import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Home from "@/app/page";
import ApplyPage from "@/app/apply/page";
import ContactPage from "@/app/contact/page";
import CarrierAgreementPage from "@/app/carrier-agreement/page";

const FORBIDDEN_ROUTES = ["/blog", "/crm", "/portal", "/dashboard", "/login", "/community"];

describe("CTA and link audit", () => {
  const pages: Array<[string, () => JSX.Element]> = [
    ["Home", Home],
    ["Apply", ApplyPage],
    ["Contact", ContactPage],
    ["Carrier Agreement", CarrierAgreementPage],
  ];

  for (const [name, Component] of pages) {
    it(`${name} has no dead CTAs and no removed-route links`, () => {
      const { container } = render(<Component />);
      const hrefs = Array.from(container.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => href !== null);
      for (const href of hrefs) {
        if (href.startsWith("http")) {
          continue;
        }
        if (href.startsWith("#")) {
          const target = href.slice(1);
          expect(container.querySelector(`#${target}`)).toBeTruthy();
          continue;
        }
        for (const forbidden of FORBIDDEN_ROUTES) {
          expect(href.split("?")[0].split("#")[0]).not.toBe(forbidden);
        }
      }
    });
  }
});