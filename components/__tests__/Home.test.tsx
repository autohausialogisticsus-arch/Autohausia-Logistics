import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders every marketing section heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Dispatch support built around your truck" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why carriers choose us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Freight We Dispatch" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How Autohausia Dispatch Works" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Frequently Asked Questions" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Industries We Serve" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Talk to a Dispatcher" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ready to Keep Your Truck Moving?" })
    ).toBeInTheDocument();
  });

  it("closes with the carrier application CTA", () => {
    render(<Home />);
    const cta = screen.getByRole("link", { name: /start your carrier application/i });
    expect(cta).toHaveAttribute("href", "/apply");
    for (const service of [
      "Freight Search",
      "Load Matching",
      "Rate Negotiation",
      "Dispatch Coordination",
      "Paperwork Support",
    ]) {
      expect(screen.getAllByText(service).length).toBeGreaterThan(0);
    }
  });

  it("does not display unsupported company statistics", () => {
    render(<Home />);
    expect(screen.queryByText(/480|2,?100/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/carriers onboard|loads booked/i)).not.toBeInTheDocument();
  });

  it("does not present fabricated customer testimonials", () => {
    render(<Home />);
    expect(screen.queryByRole("heading", { name: "What Carriers Say" })).not.toBeInTheDocument();
  });
});