import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarrierApplicationForm from "@/components/CarrierApplicationForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/First Name/i), "Jane");
  await user.type(screen.getByLabelText(/Last Name/i), "Doe");
  await user.type(screen.getByLabelText(/Company Name/i), "Doe Trucking LLC");
  await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/Phone/i), "(555) 123-4567");
  await user.type(screen.getByLabelText(/MC Number/i), "MC123456");
  await user.type(screen.getByLabelText(/USDOT Number/i), "1234567");
  await user.selectOptions(screen.getByLabelText(/Equipment Type/i), "flatbed");
  await user.type(screen.getByLabelText(/Number of Trucks/i), "2");
  await user.type(screen.getByLabelText(/Current Location/i), "Columbus, OH");
}

describe("CarrierApplicationForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("submits a valid application and shows a received message", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/application");
    expect(init).toMatchObject({ method: "POST" });
    const payload = JSON.parse((init as RequestInit).body as string);
    expect(payload.firstName).toBe("Jane");
    expect(payload.email).toBe("jane@example.com");
    expect(payload.equipmentType).toBe("flatbed");
    expect(payload.truckCount).toBe(2);

    expect(screen.getByRole("heading", { name: "Application Received" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/will review it and contact you/i);
  });

  it("blocks an empty submission with inline errors and no fetch", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid phone number.")).toBeInTheDocument();
    expect(screen.getByText("Select an equipment type.")).toBeInTheDocument();
  });

  it("rejects an invalid email inline", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    await fillValidForm(user);
    const email = screen.getByLabelText(/Email/i);
    await user.clear(email);
    await user.type(email, "not-an-email");
    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects an invalid phone inline", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    await fillValidForm(user);
    const phone = screen.getByLabelText(/Phone/i);
    await user.clear(phone);
    await user.type(phone, "abc");
    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Enter a valid phone number.")).toBeInTheDocument();
  });

  it("does not pre-check SMS consent and submits without it as false", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    const consent = screen.getByRole("checkbox", { name: /I agree to receive SMS/i });
    expect(consent).not.toBeChecked();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    const payload = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(payload.smsOptIn).toBe(false);
    expect(screen.getByRole("heading", { name: "Application Received" })).toBeInTheDocument();
  });

  it("submits only once when the form is submitted twice", async () => {
    const fetchMock = jest.fn().mockReturnValue(new Promise(() => {}));
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    const { container } = render(<CarrierApplicationForm />);
    await fillValidForm(user);

    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows a failure state and allows a retry success", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<CarrierApplicationForm />);
    await fillValidForm(user);
    const submit = screen.getByRole("button", { name: "Submit Application" });

    await user.click(submit);
    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(/Something went wrong/);
    expect(screen.queryByRole("heading", { name: "Application Received" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit Application" }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("heading", { name: "Application Received" })).toBeInTheDocument();
  });

  it("uploads a document and includes its metadata in the submit payload", async () => {
    const fetchMock = jest.fn().mockImplementation(async (url: string) => {
      if (String(url).startsWith("/api/application/upload-url")) {
        return {
          ok: true,
          json: async () => ({
            url: "https://s3.example.com/put",
            key: "applications/mc123456/mc/abc-MC.pdf",
          }),
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    const { container } = render(<CarrierApplicationForm />);
    await fillValidForm(user);

    const input = container.querySelector<HTMLInputElement>('[id="doc-mc-authority"]')!;
    const file = new File(["x"], "MC authority.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText(/MC authority\.pdf/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit Application" }));

    const submitCall = fetchMock.mock.calls.find((c) => c[0] === "/api/application");
    const payload = JSON.parse((submitCall![1] as RequestInit).body as string);
    expect(payload.documents).toEqual([
      {
        kind: "mc",
        objectKey: "applications/mc123456/mc/abc-MC.pdf",
        filename: "MC authority.pdf",
        contentType: "application/pdf",
        size: 1,
      },
    ]);
    expect(screen.getByRole("heading", { name: "Application Received" })).toBeInTheDocument();
  });
});