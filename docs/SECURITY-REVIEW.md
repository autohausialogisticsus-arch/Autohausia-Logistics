# Security Review — Autohausia Logistic Website

**Date:** 2026-08-31
**Scope:** Public website, lead-capture forms (`/contact`, `/apply`), API routes (`/api/contact`, `/api/application`), database access, environment/secrets handling, HTTP response headers, and consent privacy.
**Constraint honored:** No legitimate functionality was broken. All changes are additive hardening with the existing contract (JSON `POST` → `201 {ok:true}`, generic `400/413/415/429/500` on failure) preserved.

---

## Summary

| Area | Result |
|------|--------|
| API hardening | Good baseline; several gaps fixed (byte-size limits, content-type, honeypot, logging, memory bound) |
| Database | No SQL injection surface (Prisma parameterized); no data over-exposure |
| Forms | XSS-safe (React escaping + plain-text email); spam mitigations now on both forms |
| Environment | No secrets committed; no `NEXT_PUBLIC_*`; server/client boundary confirmed; `.gitignore` added |
| Headers | None existed before; full security-header set added via `next.config.js` |
| Privacy | SMS consent explicit and not pre-selected; timestamp stored; policy links added beside consent |

---

## API

### Input validation — **Good (verified)**
Both routes validate with Zod schemas constrained to exact field shapes:
- `contact`: name (≤200), email (≤254, email format), phone (7–40), message (≤5000), booleans.
- `application`: first/last name, MC regex `^(\d{4,8}|MC-?\d{4,8})$`, USDOT `^\d{6,8}$`, equipment enum, truck count int 1–10000.
- Unknown keys are stripped by Zod (mass-assignment protection, covered by `strips unexpected fields` test). Control characters stripped via `cleanText` (`lib/sanitize.ts`).
- Severity: Low (informational) — no change required.

### Request size limits — **Fixed**
- Both routes enforce a 32 KB body cap.
- **Vulnerability (Medium)**: the cap compared a *character count* (`raw.length`) to a *byte* budget. A `Buffer.byteLength(raw, "utf8")` check is now applied so multibyte (e.g. emoji) payloads cannot reach ~4× the intended size. Verified live: a 17k-emoji body (≈68 KB) previously admitted is now `413`.
- Remediation applies to `app/api/contact/route.ts`, `app/api/application/route.ts`.

### Malformed requests — **Good**
Malformed JSON → `400 "Malformed JSON request body."` before any validation or DB write (test-covered). Explicitly non-JSON `Content-Type` now returns `415` (new).

### Error leakage — **Fixed (improvement)**
- Client responses are generic (`500 "Server error. Please try again later."`); DB/connection details never reach the client (test asserts hostnames/`ECONNREFUSED` are not echoed).
- Previously database failures were swallowed with no log. Server-side `console.error` with the error message is now emitted in both routes (no user data logged). *Before:* a production DB outage would be silent.

### Rate limiting — **Present; two operational limitations**
- 10 req / min / endpoint / IP via in-memory token bucket (`lib/rateLimit.ts`), applied before body parsing.
- **Limitation 1 (Medium, deployment-dependent)**: the bucket is per-process. On a single long-running instance it works; on multi-instance/serverless it under-limits. Mitigate with a shared store (Redis/Upstash/DB) when scaling out — see *Remaining risks*.
- **Limitation 2 (Medium, self-host only)**: `clientIp` trusts `X-Forwarded-For`/`X-Real-IP`, which clients can set directly when there is no trusted reverse proxy. Behind a CDN/nginx (or on Vercel, where the platform sets it) this is safe. Documented in *Remaining risks*.
- **Improvement (Low)**: added a periodic sweep so the map cannot grow without bound on long-running hosts.

### Abuse prevention / HTTP methods — **Good (verified)**
- Only `POST` is exported by each route; `GET`/`PUT`/etc. return `405` (verified live).
- Honeypot (`website`) already present on `/api/application`; **added to `/api/contact`** and the ContactForm (returns success without storing — bot never learns it was trapped).

---

## Database

- **SQL injection — not applicable / good.** All writes go through `prisma.lead.create(...)` with bound parameters. No `$queryRaw`/`executeRaw`/string interpolation anywhere. Prisma generates prepared statements.
- **Excessive data exposure — good.** The lead payload is limited to the schema's typed fields; API responses expose only `{ok:true}`. There is no read/list/update API on the public site, so no data exfiltration path.
- **Constraint note (Low):** `Lead.email`/`phone` have no uniqueness constraint, so legitimate duplicate submissions are possible by design. Mitigated for bots by rate limit + honeypot; see *Remaining risks* if exact dedupe is wanted.
- **Error path:** DB exceptions are caught per-route; generic response + structured server log (see API above).

---

## Forms

- **XSS — good.** React auto-escapes all rendered values. Notifications are plain-text email (`lib/notify.ts`), not HTML. No `dangerouslySetInnerHTML` consumes user input (the single JSON-LD script injects static, server-owned data — see *Remaining risks* for a guard if that changes).
- **Malicious / oversized input — good.** Server-side Zod bounds match client-side `maxLength`; control characters stripped; 32 KB byte cap on the wire.
- **Spam — improved.** Honeypot now on **both** forms, plus per-IP rate limit on both endpoints. No CAPTCHA (deliberate trade-off for UX on a low-traffic lead form) — see *Remaining risks*.
- **Duplicate submissions — partial.** Client components prevent double-submit via a ref guard (test-covered). No server-side idempotency key. Rate limit bounds repeated identical posts.

---

## Environment / secrets

- **No `.env` in the repo**; only `.env.example` (placeholders). Verified no real `DATABASE_URL`/`RESEND_API_KEY`/Twilio values anywhere in the tree.
- **`.gitignore` did not exist** — a future `git init` could commit `.env`. **Added `.gitignore`** covering `.env*`, `.next`, `node_modules`, coverage, and build artifacts.
- **Server/client boundary — confirmed.** No `NEXT_PUBLIC_*` variables exist. `process.env` is only referenced in server-only modules (`lib/prisma.ts`, `lib/notify.ts`, `app/layout.tsx`/`robots.ts`/`sitemap.ts` via `SITE_URL`). No client component imports any env value. `CONTACT_*` constants are intentionally public contact info.
- `lib/notify.ts` exits silently when `RESEND_*` variables are missing, keeping the form functional if email is unconfigured.

---

## Headers

Added a site-wide header set via **`next.config.js`** `headers()` on `/:_path*`:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing / content-type confusion |
| `X-Frame-Options` | `DENY` | Clickjacking (legacy) |
| `Content-Security-Policy` | see config | `frame-ancestors 'none'` (clickjacking), `form-action 'self'`, `object-src 'none'`, `base-uri 'self'`, hardened `default-src` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Keeps referrer minimal cross-origin |
| `Permissions-Policy` | camera/mic/geo/payment/usb/autoplay=() | Denies browser features the site never uses |
| `Cross-Origin-Resource-Policy` | `same-origin` | Blocks cross-origin resource loading of site assets |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates from cross-origin windows |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Production only (see *Remaining risks*) |
| `x-powered-by` | removed | Stops Next.js version enumeration |

Developer previews get a dev-adjusted CSP (`script-src` adds `'unsafe-eval'`, `connect-src` allows `ws:`/`wss:`) so HMR keeps working; production does not include either.

**Verified live** on `/`, `/apply`, and API routes in the production build.

---

## Privacy

- **SMS consent is explicit and opt-in** — both checkboxes have no `checked` attribute; the application form is test-asserted to submit `smsOptIn: false` when unchecked.
- **Consent timestamp** — `Lead.consentTimestamp` is stored whenever `smsOptIn` is true (both routes); legacy model already has the column. No schema change required.
- **Privacy policy link** — previously only in the footer. **Added** `Privacy Policy`/`Terms of Service` links adjacent to the consent checkboxes in both `ContactForm` and the application form's Communications Consent section.
- Newsletter signup is a separate, unchecked box; SMS consent note confirms it is optional and separate from the application.

---

## Files changed

| File | Change |
|---|---|
| `next.config.js` | **New** — security headers, `poweredByHeader: false` |
| `.gitignore` | **New** — protects `.env*` and build artifacts |
| `app/api/contact/route.ts` | Byte-size limit, `415` content-type check, honeypot, server-side error logging |
| `app/api/application/route.ts` | Byte-size limit, `415` content-type check, server-side error logging |
| `lib/rateLimit.ts` | Cap on in-memory bucket size (expired-entry sweep) |
| `components/ContactForm.tsx` | Honeypot field + payload, privacy/terms links |
| `components/CarrierApplicationForm.tsx` | Privacy/terms links in consent section |

No database/schema changes.

---

## Verification performed

- `npm test` — 64/64 suites pass (including existing route/form/security assertions).
- `next lint` — clean; `tsc --noEmit` — clean.
- `npm run build` — succeeds; all 23 routes/static pages generated.
- Production server (`next start`) header audit — all security headers present on HTML and API responses; `x-powered-by` gone.
- Live API checks: `GET /api/contact` → `405`; `text/plain` body → `415`; 50 KB body → `413`; 68 KB emoji body → `413` (byte check); malformed JSON → `400`; honeypot-filled contact → `201` without storing.

---

## Remaining risks & recommendations

1. **Rate limiter is in-memory (Medium if horizontally scaled).** Move to a shared store (Upstash Redis, or a DB-backed counter) before running multiple instances/serverless. Current single-process behavior is fine.
2. **Client-IP trust for rate limiting (Medium, self-host only).** Deploy behind a reverse proxy/CDN that overwrites `X-Forwarded-For`, or derive IP from the platform (e.g. Vercel `request.ip`). No change needed on Vercel.
3. **No CAPTCHA (Low/Medium).** Honeypot + rate limit deter casual bots. If spam becomes visible, add Cloudflare Turnstile or hCaptcha server-side verification on `/api/application` (and optionally `/api/contact`).
4. **CSP still uses `script-src 'unsafe-inline'`** (required by Next.js's inline hydration bootstrap). Protection is meaningful but not strict against stored-XSS. Pursuing nonce/hash-based CSP is possible with custom middleware — recommended before handling any user-rendered content.
5. **HSTS is production-only.** Enforced only when traffic is HTTPS; ensure the host terminates TLS (HSTS is ignored over plain HTTP and harmless in dev).
6. **No server-side dedupe key.** If duplicate-application prevention is ever required, add an idempotency token (signed one-time nonce) or a DB unique constraint on `(email, phone)` scoped per day.
7. **JSON-LD uses `dangerouslySetInnerHTML`.** Currently fed only static constants; if any user-supplied value is ever interpolated there, switch to escaping or pass data non-DOM (e.g. via `process.env` build-time constants).
8. **SMS consent via bare API `POST`** can be asserted externally with `smsOptIn:true`. This is inherent to a public endpoint; the timestamp is still recorded. A signed client nonce tied to the rendered page would let you distinguish a browser-issued consent from a scripted one (nice-to-have).