# Roadmap: Build Your Dispatch Company Website
(Same page set & features as FleetX Logistics LLC — original code, your brand)

## 0. Stack Decision

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 14 (React) + Tailwind CSS** | Fast to build, SEO-friendly (server-rendered), one codebase for pages + API |
| Backend | **Next.js API routes (Node.js)** | No separate server needed — API lives in the same project |
| Database | **PostgreSQL + Prisma ORM** | Free tier available (Supabase/Neon/Railway), type-safe queries |
| Auth (carrier login) | **NextAuth.js** | Handles sessions, password hashing, login forms out of the box |
| Email/SMS | **Resend (email) + Twilio (SMS)** | Contact form notifications + SMS opt-in compliance |
| Hosting | **Vercel (frontend+API)** + **Neon/Supabase (DB)** | Both have free tiers, deploy via `git push` |
| Blog | Simple **Post** table in the same DB, or **MDX files** if you want zero-DB simplicity | Matches their `/Blog` page |

---

## 1. Project Setup (Day 1)

```bash
npx create-next-app@latest dispatch-site --typescript --tailwind --app
cd dispatch-site
npm install prisma @prisma/client next-auth bcryptjs resend
npx prisma init
```

Folder structure you'll end up with:
```
app/
  page.tsx                 → Home (/)
  blog/page.tsx             → Blog listing
  blog/[slug]/page.tsx      → Blog post
  privacy/page.tsx          → Privacy Policy
  terms/page.tsx            → Terms of Service
  carrier-agreement/page.tsx
  login/page.tsx            → Carrier login
  dashboard/page.tsx        → Logged-in carrier portal
  api/
    contact/route.ts        → Contact form handler
    auth/[...nextauth]/route.ts
    leads/route.ts          → Admin: view leads
prisma/
  schema.prisma
components/
  Header.tsx, Hero.tsx, StatsCounter.tsx, About.tsx,
  WhyChooseUs.tsx, ServicesGrid.tsx, FAQAccordion.tsx,
  Testimonials.tsx, ContactForm.tsx, IndustriesGrid.tsx, Footer.tsx
```

---

## 2. Database Schema (Day 1–2)

```prisma
// prisma/schema.prisma
model Carrier {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  createdAt DateTime @default(now())
}

model Lead {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  message   String
  smsOptIn  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Testimonial {
  id      String @id @default(cuid())
  quote   String
  author  String
  company String
}
```
Run: `npx prisma migrate dev --name init`

---

## 3. Build Order (Week 1)

Build in this order — each step is demoable on its own:

1. **Header + Footer** — logo, phone, email, nav links, matches FleetX's sticky-header layout
2. **Hero section** — headline + background image + CTA button
3. **Stats counter** — 3 numbers that animate on scroll (use `react-countup` or a small custom hook with `IntersectionObserver`)
4. **About section** — 2–3 paragraphs, plain Tailwind two-column layout
5. **Why Choose Us** — 3 feature blocks (image + text), alternating left/right
6. **Services grid** — 6 cards (Flatbed, Step Deck, Dry Van, Power Only, Box Truck, Hotshot), each with a hover image swap (`onMouseEnter` swap `src`, or CSS `:hover` with two stacked images)
7. **FAQ accordion** — use a simple `<details>`/`<summary>` or a small React accordion component, 8 Q&As
8. **Testimonials carousel** — `embla-carousel-react` or `swiper` npm package, 8 reviews
9. **Industries grid** — icon + label, 12 items, CSS grid
10. **Contact form** — Name/Email/Phone/Message + SMS opt-in checkbox + newsletter checkbox

---

## 4. Backend Features (Week 2)

### Contact form → `api/contact/route.ts`
- Validate input (use `zod`)
- Save to `Lead` table via Prisma
- Send yourself an email notification (Resend)
- If `smsOptIn` is true, store consent timestamp (needed for **TCPA compliance** — same as FleetX's checkbox language)

### Carrier login → NextAuth + `Carrier` model
- Credentials provider (email/password, hashed with `bcryptjs`)
- Protected `/dashboard` route showing carrier-specific info (loads, documents — build out later)

### Blog
- `Post` table + simple admin form to create/edit posts, or start with MDX files in `/content/blog/*.mdx` if you don't want an admin UI yet

### Legal pages
- Privacy, Terms, Carrier Agreement — static content pages (have a lawyer review real language before launch; don't copy another company's legal text verbatim)

---

## 5. Compliance Notes (important, don't skip)

- **SMS opt-in**: if you plan to text leads, you need explicit consent language + "Reply STOP to opt out" — this is a **TCPA legal requirement**, not just UI decoration
- **Privacy Policy / Terms**: must reflect *your* actual data practices — have these drafted or reviewed by a lawyer, don't reuse FleetX's wording
- **Carrier Agreement**: this is a real contract carriers sign — get it from a transportation attorney, not copied from a competitor's site

---

## 6. Deployment (Day when ready)

1. Push repo to GitHub
2. Connect to Vercel → auto-deploys on push
3. Create free Postgres DB on Neon or Supabase, add `DATABASE_URL` to Vercel env vars
4. Add `RESEND_API_KEY`, `NEXTAUTH_SECRET`, `TWILIO_*` env vars
5. Point your domain's DNS to Vercel

---

## 7. Suggested Timeline

| Week | Focus |
|---|---|
| 1 | Frontend pages/sections (static, no backend yet) |
| 2 | Database + contact form + carrier login |
| 3 | Blog, legal pages, polish, mobile responsiveness |
| 4 | Testing, real content/photos, deploy, DNS, launch |

---

## Next step

I can scaffold the actual Next.js project now — real component code for the header, hero, services grid, FAQ accordion, contact form with working API route, and the Prisma schema — so you have working code to run locally, not just this plan. Want me to start generating that code?
