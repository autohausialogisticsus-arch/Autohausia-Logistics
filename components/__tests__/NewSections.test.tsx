import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrustMetrics from "@/components/TrustMetrics";
import Testimonials from "@/components/Testimonials";

describe("TrustMetrics", () => {
  it("renders the three requested metrics with labels", () => {
    render(<TrustMetrics />);
    expect(screen.getByText("5,000+")).toBeInTheDocument();
    expect(screen.getByText("Happy Customers")).toBeInTheDocument();
    expect(screen.getByText("$7,500+")).toBeInTheDocument();
    expect(screen.getByText("Avg Gross per Week")).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("Happy Clients")).toBeInTheDocument();
  });

  it("does not include an unrelated 'Expert Cleaner' metric", () => {
    render(<TrustMetrics />);
    expect(screen.queryByText("Expert Cleaner")).not.toBeInTheDocument();
  });
});

describe("Testimonials", () => {
  it("renders the correct heading and supporting text", () => {
    render(<Testimonials />);
    expect(screen.getByText("What Our Drivers Are Saying")).toBeInTheDocument();
    expect(
      screen.getByText(/Real experiences from carriers who trust Autohausia/)
    ).toBeInTheDocument();
  });

  it("shows the first testimonial by default", () => {
    render(<Testimonials />);
    expect(screen.getByText("John D.")).toBeInTheDocument();
    expect(screen.getByText("Owner-Operator")).toBeInTheDocument();
  });

  it("navigates forward with the Next button", async () => {
    const user = userEvent.setup();
    render(<Testimonials />);
    await user.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(screen.getByText("Michael R.")).toBeInTheDocument();
  });

  it("navigates backward with the Previous button", async () => {
    const user = userEvent.setup();
    render(<Testimonials />);
    await user.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(screen.getByText("David K.")).toBeInTheDocument();
  });

  it("jumps to a testimonial via the pagination dots", async () => {
    const user = userEvent.setup();
    render(<Testimonials />);
    await user.click(screen.getByRole("button", { name: "Go to testimonial 3" }));
    expect(screen.getByText("David K.")).toBeInTheDocument();
    expect(screen.getByText("Carrier")).toBeInTheDocument();
  });
});
