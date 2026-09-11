# Autohausia Logistic LLC — Project Audit Report

**Date:** Aug 31, 2026
**Mode:** Audit only — no functional code was changed.
**Build baseline:** `npm run build` PASSES.

---

## 1. Current Architecture

- **Framework:** Next.js 14.2.5 (App Router, `app/` directory), React 18.3.1
- **Styling:** Tailwind CSS 3.4.6 (custom palette in `tailwind.config.ts`, no plugins)
- **Database:** PostgreSQL via Prisma ORM 5.18 (`prisma/schema.prisma`), client singleton in `lib/prisma.ts`
- **Auth:** NextAuth 4.24.7, JWT session strategy, single Credentials provider (`lib/auth.ts`)
- **Validation:** Zod 3.23.8 (contact API only)
- **Email/SMS:** Resend 3.5.0 (installed but **unused** — import commented out); Twilio referenced only in `.env.example`
- **Fonts:** Oswald / Inter / IBM Plex Mono via `next/font/google` in `app/layout.tsx`
- **Icons/images:** Zero external images — all artwork is inline SVG (hero route line, per-service truck art)
- **Config files present:** `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next-env.d.ts`
- **Config files absent:** `next.config.*`, `middleware.ts`, `.env`, `prisma/migrations/`, `public/`, any ESLint config

## 2. Current Routes (App Router)

| Route | File | Type | Auth | Notes |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Static | — | Home, 9 sections in `<main>` |
| `/login` | `app/login/page.tsx` | Static (client) | — | NextAuth credentials sign-in |
| `/dashboard` | `app/dashboard/page.tsx` | Static | **None** | Placeholder text only |
| `/privacy` | `app/privacy/page.tsx` | Static | — | Placeholder legal text |
| `/terms` | `app/terms/page.tsx` | Static | — | Placeholder legal text |
| `/carrier-agreement` | `app/carrier-agreement/page.tsx` | Static | — | Placeholder legal text |
| `/api/contact` | `app/api/contact/route.ts` | Dynamic POST | — | Validates + persists Lead |
| `/api/leads` | `app/api/leads/route.ts` | Dynamic GET | Session required | Returns all leads |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Dynamic | — | NextAuth handler |

Build confirmed 11 routes (10 pages + not-found).

## 3. Current Components (all in `components/`)

All 11 components are used. No duplicates, no dead components.

| Component | Used by | Notes |
|---|---|---|
| `Header.tsx` | layout | Sticky nav; no mobile menu (nav is `hidden md:flex`) |
| `Footer.tsx` | layout | Legal links |
| `Hero.tsx` | app/page | Inline SVG route-line motif |
| `StatsCounter.tsx` | app/page | `use client`, scroll-triggered count-up |
| `About.tsx` | app/page | Text only |
| `WhyChooseUs.tsx` | app/page | 3 features, `#why-us` anchor |
| `ServicesGrid.tsx` | app/page | `#services`; SVG truck art per service, hover swap |
| `IndustriesGrid.tsx` | app/page | 12 industries |
| `FAQAccordion.tsx` | app/page | `#faq`; native `<details>` accordion |
| `Testimonials.tsx` | app/page | `use client`, carousel |
| `ContactForm.tsx` | app/page | `use client`, posts to `/api/contact` |

## 4. Current Database Models (`prisma/schema.prisma`)

| Model | Fields | Used by |
|---|---|---|
| `Carrier` | id, email (unique), password, name, phone?, createdAt | NextAuth credentials (login) |
| `Lead` | id, name, email, phone, message, smsOptIn, consentTimestamp?, newsletter, createdAt | Contact API |
| `Testimonial` | id, quote, author, company? | **Unused** (testimonials hardcoded in `components/Testimonials.tsx`) |

- **No** `User`, `Account`, `Session` models — NextAuth runs JWT strategy (no DB sessions).
- **No** `Post` model — blog already removed.
- **No** `prisma/migrations/` directory — schema has never been migrated; DB setup has not happened.

## 5. Current APIs

- **`POST /api/contact`** (`app/api/contact/route.ts`) — Zod-validates `{name, email, phone, message, smsOptIn, newsletter}`, persists `Lead` with `consentTimestamp` when `smsOptIn`. Resend email notification is commented out. All errors (validation AND DB failures) collapse to a 400 "Invalid submission".
- **`GET /api/leads`** (`app/api/leads/route.ts`) — Requires *any* NextAuth session, returns all leads (full PII: name/email/phone/message). No role check; any carrier can read every lead. No pagination.
- **`/api/auth/[...nextauth]`** — Standard NextAuth handler backed by `lib/auth.ts`.

## 6. Authentication / CRM Inventory

Files:
- `lib/auth.ts` — `authOptions` (JWT strategy, credentials provider, bcrypt compare against `Carrier`)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `app/login/page.tsx` — credentials sign-in UI
- `app/dashboard/page.tsx` — **placeholder, NOT protected**
- `app/api/leads/route.ts` — session-protected lead viewer (CRM-ish; the only "CRM" surface)

Findings:
- `/dashboard` has **no session guard** and no middleware — it renders publicly.
- No sign-out UI anywhere.
- No admin/role concept — `api/leads` is effectively "any logged-in carrier sees all leads".
- No self-service carrier signup; accounts must be created manually (per README).

## 7. Blog Inventory

**None.** `app/blog` does not exist. `Post` model already removed. No blog nav links, metadata, or dependencies. Phase 2's blog removal is already done; only "Remove CRM/Auth" remains.

## 8. Lead / Contact Inventory

- Form: `components/ContactForm.tsx` (name, email, phone, message, SMS opt-in, newsletter checkbox)
- API: `app/api/contact/route.ts` (Zod validation)
- Persistence: `Lead` Prisma model (with `consentTimestamp` for TCPA)
- Email notification: **commented out** (Resend installed, `RESEND_API_KEY` in `.env.example`)
- Spam protection: **none** — no honeypot, captcha, or rate limiting
- Consent: TCPA opt-in checkbox + "Reply STOP to opt out" present (good)
- Error handling: generic; DB failures reported as "Invalid submission"

## 9. Problems Found

### Build / tooling
- `npm run lint` fails — ESLint not configured; `next lint` enters an interactive setup prompt. No `.eslintrc`, no `eslint` dependency.
- `npm test` fails — no test script, no test framework installed.
- No `next.config.*` — no headers, redirects, image config, sitemap/robots handling.

### Security
- `/dashboard` unprotected (no middleware, no `getServerSession`).
- `GET /api/leads` exposes all lead PII to any authenticated carrier (no admin role).
- No rate limiting on `/api/contact` or credentials auth (brute-force / spam vector).
- No security headers / CSP.
- Contact endpoint collapses DB errors into 400 — leaks nothing but masks failure (minor).

### SEO
- Single global `metadata` in `app/layout.tsx` only; no per-page titles/descriptions for `/login`, `/dashboard`, legal pages.
- No OpenGraph / Twitter cards, no canonical URLs, no `sitemap.ts`, no `robots.txt`.
- No `public/` dir — no favicon, og:image, or real imagery (all SVG inline).
- No `next.config` for headers/redirects.

### Accessibility
- Text inputs rely on placeholders only — **no `<label>`** elements (ContactForm, login).
- Header nav is `hidden md:flex` — **no mobile navigation at all**, and no hamburger.
- No skip-to-content link.
- Testimonial carousel content changes without `aria-live`; arrows hidden on mobile (no alternative swipe).
- No focus-visible styling customizations (defaults only).

### Content / placeholders
- `StatsCounter` shows hardcoded fake numbers (480 carriers, 2100 loads/mo, 15 hrs) presented as fact.
- 8 fabricated testimonials hardcoded (`Testimonials.tsx`).
- 3 legal pages are placeholders (privacy, terms, carrier agreement).
- Phone is `(000) 000-0000` with `tel:+10000000000`; email `info@autohausia.com` placeholder.
- `Testimonial` Prisma model exists but is unused (hardcoded array wins).

### Data / infra
- No `.env`, no `prisma/migrations` — **database never migrated**; contact form will fail at runtime without DB config.
- `resend` dependency unused (dead weight) — `@react-email/render` pulled in transitively.
- Contact API uses the commented-out Resend block; no lead notification path exists.

### Code quality
- TypeScript strict passes — no TS errors.
- Minor: `/api/contact` single catch-all returns 400 even for server-side failures.

## 10. Files Likely to Be Removed

Per roadmap Phase 2 (CRM/Auth removal):
- `lib/auth.ts`
- `app/login/page.tsx`
- `app/dashboard/page.tsx`
- `app/api/auth/[...nextauth]/route.ts`
- `Carrier` model from `prisma/schema.prisma`
- `next-auth`, `bcryptjs`, `@types/bcryptjs` deps (and `Carrier` password logic)
- `resend` dependency (currently unused) — re-add only if email notifications are actually wired

Also candidates:
- `app/api/leads/route.ts` — depends on auth; decide whether leads become admin-only via a new mechanism or removed with CRM
- `Testimonial` model — unused unless testimonials are wired to DB

## 11. Files That Must Be Preserved

- **Public site foundation:** `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, all 11 components
- **Lead capture:** `app/api/contact/route.ts`, `ContactForm.tsx`, `Lead` model
- **Legal pages:** `app/privacy`, `app/terms`, `app/carrier-agreement`
- **Infra:** `lib/prisma.ts`, `prisma/schema.prisma`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`
- **Docs:** plan/roadmap docs for continuity

## 12. Baseline Test Results

| Command | Result | Notes |
|---|---|---|
| `npm run build` | **PASS** | 11 routes compiled, no warnings/errors |
| `npx tsc --noEmit` | **PASS** | strict mode, 0 errors |
| `npm run lint` | **FAIL** | no ESLint config; `next lint` prompts interactively |
| `npm test` | **FAIL** | no `test` script / framework |
| `npm run dev` | n/a | not exercised (build proves compilation) |

Dependency inventory check passed: nothing missing for the current build (only `resend` unused).

## 13. Recommended Implementation Sequence

Aligned to the enhancement roadmap phases:

1. **Phase 2 — Remove CRM/Auth:** delete auth login/dashboard/auth API/`lib/auth.ts` + `Carrier` model + deps. Rebuild as marketing + lead-capture only.
2. **Phase 3 — Architecture & Nav:** restore working mobile navigation; define IA (one-pager anchors + legal + carrier-application page).
3. **Phase 4 — Hero/Homepage:** replace SVG-only hero with proper imagery/CTA; wire real stats or mark them as example data.
4. **Phases 5–7 — About / Why Us / Services / How It Works:** enrich copy, keep the strong existing sections.
5. **Phase 8 — Carrier Application:** new application page + `/api/application` persistence.
6. **Phase 9 — Lead Backend:** harden `/api/contact` (labels, rate limiting, honeypot, distinct error codes), wire Resend notifications if desired.
7. **Phases 10–12 — FAQ / Testimonials / Agreement / Contact + CTA.**
8. **Phase 13 — SEO:** per-page metadata, OG/Twitter, sitemap, robots, favicon, canonical, `next.config`.
9. **Phase 14 — Responsive/Polish:** mobile nav, a11y (labels, skip link, focus states, live regions).
10. **Phase 15 — Security:** middleware/route guards, rate limits, security headers; admin-only lead view.
11. **Phase 16–17 — Testing & Production:** install lint + test tooling, CI, migrations, deploy config.

## Final confirmation

No functional code was changed during this audit. Report written to `docs/AUTOHAUSIA-AUDIT.md`.