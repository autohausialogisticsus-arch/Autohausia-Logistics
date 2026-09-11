import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FAQAccordion from "@/components/FAQAccordion";

describe("FAQAccordion", () => {
  it("renders 12 questions inside a disclosure list, initially closed", () => {
    const { container } = render(<FAQAccordion />);
    const summaries = container.querySelectorAll("summary");
    const details = container.querySelectorAll("details");
    expect(summaries).toHaveLength(12);
    expect(details).toHaveLength(12);
    for (const detail of details) {
      expect(detail).not.toHaveAttribute("open");
    }
  });

  it("opens and closes a question with a click", async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion />);
    const heading = screen.getByText(/What equipment do you dispatch\?/i);
    const summary = heading.closest("summary") as HTMLElement;
    const detail = summary.closest("details") as HTMLDetailsElement;
    expect(detail).not.toHaveAttribute("open");

    await user.click(summary);
    expect(detail).toHaveAttribute("open");
    expect(screen.getByText(/flatbed, step deck, dry van/i)).toBeInTheDocument();

    await user.click(summary);
    expect(detail).not.toHaveAttribute("open");
  });

  it("keeps questions inside a semantic h3 heading structure", () => {
    const { container } = render(<FAQAccordion />);
    const headings = container.querySelectorAll("h3");
    expect(headings).toHaveLength(12);
    expect(headings[0].textContent).toContain("What equipment do you dispatch?");
  });

  it("provides distinct disclosure controls with the question as their label", () => {
    render(<FAQAccordion />);
    expect(screen.getAllByText("+")).toHaveLength(12);
    const q = screen.getByText(/Do I have to approve loads/i);
    expect(q.closest("summary")).not.toBeNull();
  });
});