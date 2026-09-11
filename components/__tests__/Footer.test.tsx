import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("shows the brand and year", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "AUTOHAUSIA LOGISTIC LLC" })).toHaveAttribute(
      "href",
      "/"
    );
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} Autohausia Logistic LLC. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it("links to the primary navigation sections", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(nav).toHaveAccessibleName("Footer");
    for (const [label, href] of [
      ["Home", "/"],
      ["Services", "/services"],
      ["About", "/about"],
      ["Why Choose Us", "/why-choose-us"],
      ["FAQs", "/faq"],
      ["Contact", "/contact"],
      ["Carrier Application", "/apply"],
    ]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }
  });

  it("links to the legal pages", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy"
    );
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(screen.getByRole("link", { name: "Carrier Agreement" })).toHaveAttribute(
      "href",
      "/carrier-agreement"
    );
  });

  it("shows verified contact details only", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "(319) 493-7195" })).toHaveAttribute(
      "href",
      "tel:+13194937195"
    );
    expect(screen.getByRole("link", { name: "Autohausialogistics.us@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:Autohausialogistics.us@gmail.com"
    );
  });
});