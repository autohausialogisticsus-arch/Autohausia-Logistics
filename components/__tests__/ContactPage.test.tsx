import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";
import * as contact from "@/lib/contact";

describe("Contact page", () => {
  it("shows the verified phone", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: contact.CONTACT_PHONE_DISPLAY })).toHaveAttribute(
      "href",
      `tel:${contact.CONTACT_PHONE_TEL}`
    );
  });

  it("shows the verified email", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: contact.CONTACT_EMAIL })).toHaveAttribute(
      "href",
      `mailto:${contact.CONTACT_EMAIL}`
    );
  });

  it("does not invent business details", () => {
    render(<ContactPage />);
    expect(screen.queryByText(/address|mile|\b(?:suite|st\.|ave\.|road)\b/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/24\/7|business hours/i)).not.toBeInTheDocument();
  });

  it("offers the carrier application CTA", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: "Start Your Carrier Application" })).toHaveAttribute(
      "href",
      "/apply"
    );
  });

  it("includes the contact form and does not claim approval", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { name: "Send a Message" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Full name" })).toBeInTheDocument();
    expect(
      screen.getByText(/does not approve your carrier/i)
    ).toBeInTheDocument();
  });
});