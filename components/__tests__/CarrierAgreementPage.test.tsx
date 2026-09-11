import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarrierAgreementPage from "@/app/carrier-agreement/page";
import { AGREEMENT_SECTIONS } from "@/lib/carrierAgreement";

describe("Carrier Agreement page", () => {
  it("renders all agreement framework sections", () => {
    render(<CarrierAgreementPage />);
    const section = screen.getByRole("region", { name: "Agreement sections" });
    for (const item of AGREEMENT_SECTIONS) {
      expect(
        within(section).getByRole("heading", { name: new RegExp(item.title) })
      ).toBeInTheDocument();
    }
  });

  it("labels every section whose legal text is still pending", () => {
    render(<CarrierAgreementPage />);
    const pendingSections = AGREEMENT_SECTIONS.filter((s) => !s.structured);
    expect(pendingSections.length).toBeGreaterThan(0);
    const section = screen.getByRole("region", { name: "Agreement sections" });
    const badges = within(section).getAllByText(/legal text pending/i);
    expect(badges.length).toBe(pendingSections.length);
    expect(within(section).getAllByText(/pending legal review/i).length).toBeGreaterThan(0);
  });

  it("clearly states that the terms are not attorney-approved", () => {
    render(<CarrierAgreementPage />);
    expect(screen.getByText(/must be drafted and approved by Autohausia Logistic and qualified legal counsel/i)).toBeInTheDocument();
    expect(screen.getByText(/no language on this page has been reviewed or approved by an attorney/i)).toBeInTheDocument();
    expect(screen.getByText(/Not for execution/i)).toBeInTheDocument();
  });

  it("does not capture signatures or accept the agreement on screen", () => {
    render(<CarrierAgreementPage />);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sign|accept|agree/i })).not.toBeInTheDocument();
    expect(screen.getByText(/does not collect, store, or process signatures/i)).toBeInTheDocument();
  });

  it("links to the carrier application", () => {
    render(<CarrierAgreementPage />);
    const cta = screen.getByRole("link", { name: "Start Your Application" });
    expect(cta).toHaveAttribute("href", "/apply");
  });

  it("prints via the Print / Save as PDF button", async () => {
    const user = userEvent.setup();
    const print = jest.fn();
    window.print = print;
    render(<CarrierAgreementPage />);
    await user.click(screen.getByRole("button", { name: /print \/ save as pdf/i }));
    expect(print).toHaveBeenCalledTimes(1);
  });
});