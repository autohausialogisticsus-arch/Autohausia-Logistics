"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";

export default function ContactForm({ embedded = false }: { embedded?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const submittedRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittedRef.current) return;
    submittedRef.current = true;
    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      smsOptIn: formData.get("smsOptIn") === "on",
      newsletter: formData.get("newsletter") === "on",
      website: String(formData.get("website") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      submittedRef.current = false;
    }
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Full name"
          minLength={1}
          maxLength={200}
          className="w-full rounded-sm border border-line bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate/60 focus:border-amber focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          maxLength={254}
          className="w-full rounded-sm border border-line bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate/60 focus:border-amber focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-ink">
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Phone"
          minLength={7}
          maxLength={40}
          className="w-full rounded-sm border border-line bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate/60 focus:border-amber focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your truck and lanes"
          minLength={1}
          maxLength={5000}
          className="w-full resize-y rounded-sm border border-line bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate/60 focus:border-amber focus:outline-none"
        />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <label className="flex items-start gap-3 text-xs text-slate">
        <input type="checkbox" name="smsOptIn" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          I agree to receive SMS updates about my loads. Message and data rates
          may apply. Reply STOP to opt out.
        </span>
      </label>
      <label className="flex items-start gap-3 text-xs text-slate">
        <input type="checkbox" name="newsletter" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Sign me up for trucking industry news and load tips. No spam,
          unsubscribe anytime.
        </span>
      </label>
      <p className="text-xs text-slate">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="font-medium text-ink underline underline-offset-2 hover:text-amber">
          Terms of Service
        </Link>
        .
      </p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-sm bg-ink py-3.5 font-semibold text-white transition hover:bg-steel disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "sent" && (
        <p role="status" className="text-center text-sm text-green-600">
          Thanks — a dispatcher will reach out shortly.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-center text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );

  if (embedded) {
    return <div className="rounded-sm border border-line bg-white p-5 sm:p-6">{form}</div>;
  }

  return (
    <section id="contact" className="relative py-14 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-6 overflow-hidden">
        {/* Contact photography */}
        <Image
          src="/images/Contact-Truck-Highway.png"
          alt="Semi truck traveling on a highway for freight transportation"
          width={2880}
          height={1620}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          priority={false}
        />

        {/* Dark overlay for form readability */}
        <div
          className="absolute inset-0 bg-[rgba(11,18,32,0.35)] pointer-events-none"
        />

        {/* Form panel over the background */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="lg:w-1/2">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Talk to a Dispatcher
            </h2>
            <div className="mt-8 rounded-sm border border-white/30 bg-white/80 backdrop-blur-sm p-5 sm:p-6 lg:mt-10">
              {form}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}