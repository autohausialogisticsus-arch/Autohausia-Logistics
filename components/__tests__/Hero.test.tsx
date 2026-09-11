import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("states the value proposition with eyebrow, headline, and CTAs", () => {
    render(<Hero />);
    expect(screen.getByText("Truck Dispatch Services")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Keep Your Truck Moving.");
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/apply"
    );
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("lists the dispatch services", () => {
    render(<Hero />);
    for (const service of [
      "Freight Search",
      "Load Matching",
      "Rate Negotiation",
      "Dispatch Coordination",
      "Paperwork Support",
    ]) {
      expect(screen.getByText(service)).toBeInTheDocument();
    }
  });

  it("does not fabricate company statistics", () => {
    render(<Hero />);
    expect(screen.queryByText(/480|2100|2,100|15\s*hours/i)).not.toBeInTheDocument();
  });
});