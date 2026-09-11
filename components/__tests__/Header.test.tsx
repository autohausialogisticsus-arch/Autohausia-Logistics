import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

import { usePathname } from "next/navigation";
const usePathnameMock = usePathname as jest.Mock;

describe("Header", () => {
  it("renders the brand", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "AUTOHAUSIA LOGISTIC LLC" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders the primary navigation links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Why Choose Us" })).toHaveAttribute("href", "/why-choose-us");
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });

  it("marks the active nav link based on the current path", () => {
    let mockPath = "/services";
    usePathnameMock.mockImplementation(() => mockPath);
    const { rerender } = render(<Header />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
    mockPath = "/services/flatbed-dispatch";
    rerender(<Header />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
  });

  it("shows a Get Started CTA and no carrier login", () => {
    render(<Header />);
    const cta = screen.getAllByText("Get Started").filter((el) =>
      el.closest("a")?.getAttribute("href") === "/apply"
    );
    expect(cta.length).toBeGreaterThan(0);
    expect(screen.queryByText("Carrier Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("opens and closes the mobile menu, closing after navigation", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    const faq = within(mobileNav).getByRole("link", { name: "FAQs" });
    await user.click(faq);

    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu with Escape and restores focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});