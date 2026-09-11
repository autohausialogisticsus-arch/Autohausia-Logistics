"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/contact";
import { ArrowRightIcon } from "@/components/icons";

const NAV = [
  { label: "Home", href: "/", id: "home" },
  { label: "Services", href: "/services", id: "services" },
  { label: "About", href: "/about", id: "about" },
  { label: "Why Choose Us", href: "/why-choose-us", id: "why-us" },
  { label: "FAQs", href: "/faq", id: "faq" },
  { label: "Contact", href: "/contact", id: "contact" },
];

const SECTION_IDS = ["services", "about", "why-us", "faq", "contact"];

export default function Header() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const current =
    pathname === "/"
      ? active
      : (NAV.find(
          (item) => item.href !== "/" && pathname.startsWith(item.href)
        )?.id ?? "home");

  // Scroll-spy: highlight the section currently in view (homepage only).
  useEffect(() => {
    if (pathname !== "/") return;
    const probe = 200;
    const update = () => {
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // While the mobile menu is open: focus its first link and trap Tab focus
  // inside the menu so keyboard users never tab into the page behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;

    const items = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );

    items()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = items();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Close the mobile menu when the viewport grows to desktop size.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const selectNav = (id: string) => {
    if (pathname === "/") setActive(id);
    setMenuOpen(false);
  };

  return (
    <>
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-amber focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
    >
      Skip to main content
    </a>
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:py-5">
        <Link
          href="/"
          onClick={() => selectNav("home")}
          aria-label="AUTOHAUSIA LOGISTIC LLC"
          className="group flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="h-6 w-1 rounded-full bg-amber transition group-hover:bg-amber/80"
          />
          <span className="whitespace-nowrap font-display text-base font-semibold uppercase tracking-[0.08em] text-white transition group-hover:text-amber sm:text-lg lg:text-xl">
            Autohausia
          </span>
          <span className="hidden whitespace-nowrap font-display text-base font-semibold uppercase tracking-[0.08em] text-white/40 sm:inline lg:text-xl">
            Logistics
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => selectNav(item.id)}
              aria-current={current === item.id ? "page" : undefined}
              className={`group relative py-1.5 text-sm font-medium transition-colors ${
                current === item.id ? "text-amber" : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-0.5 h-px bg-amber transition-all ${
                  current === item.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-60"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="hidden text-sm whitespace-nowrap text-white/60 transition hover:text-amber md:block"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden text-sm whitespace-nowrap text-white/60 transition hover:text-amber xl:block"
          >
            {CONTACT_EMAIL}
          </a>
          <Link
            href="/apply"
            onClick={() => setMenuOpen(false)}
            className="group hidden items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-amber/90 lg:inline-flex"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:text-amber lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M5 8h14M5 16h14" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-white/10 bg-ink lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-0.5 px-6 py-6 sm:px-8">
            <Link
              href="/apply"
              onClick={() => setMenuOpen(false)}
              className="mb-5 inline-flex items-center justify-center gap-2 rounded-md bg-amber px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-amber/90"
            >
              Get Started
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            {NAV.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => selectNav(item.id)}
                aria-current={current === item.id ? "page" : undefined}
                className={`block py-3 text-base font-medium transition hover:text-amber ${
                  current === item.id ? "text-amber" : "text-white/80"
                } ${index > 0 ? "border-t border-white/5" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
    </>
  );
}