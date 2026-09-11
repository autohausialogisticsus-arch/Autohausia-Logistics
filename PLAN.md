# Autohausia Logistic LLC — Build Plan

## Status: COMPLETE (Phase 1–6) — enhancements applied

## Phase 1: Project Scaffold
- [x] Copy `dispatch-site` → `autohausia-logistics-site`
- [x] Update `package.json`: name → `autohausia-logistics-site`
- [x] **Remove blog:**
  - [x] Delete `app/blog/page.tsx`
  - [x] Delete `app/blog/[slug]/page.tsx`
  - [x] Remove `Post` model from `prisma/schema.prisma`
  - [x] Remove "Blog" links in Header/Footer

## Phase 2: Branding
- [x] Replace "Your Dispatch Co." → **"Autohausia Logistic LLC"** everywhere
- [x] Keep current navy/amber palette
- [x] Keep current services (Flatbed, Step Deck, Dry Van, Power Only, Box Truck, Hotshot)
- [x] Use placeholders for phone/email

## Phase 3: Content & Sections
- [x] Rebrand Header, Footer, Layout Metadata
- [x] Rebrand Hero, Stats, About, Why Choose Us
- [x] Industries Grid, Testimonials, FAQ
- [x] Contact form (Zod validation, saves `Lead`)

## Phase 4: Backend
- [x] Add `api/leads/route.ts` (admin view leads)
- [x] Add `consentTimestamp` to `Lead` for TCPA compliance
- [x] Keep NextAuth carrier login

## Phase 5: Legal
- [x] Ensure Privacy Policy, Terms, Carrier Agreement are marked as placeholders

## Phase 6: Verification
- [x] `npm install`
- [x] `npm run build` — passes (all routes compile, blog removed)
- [x] Fixed auth: moved `authOptions` to `lib/auth.ts` (route files can't export non-handler types)
- [x] Generated Prisma client

## Phase 7: FleetX-parity enhancements (from live-site review)
- [x] **Newsletter checkbox** added to contact form (original wording)
- [x] `newsletter Boolean` added to `Lead` schema + contact API (Zod validated)
- [x] **Services hover image swap** — original inline SVG truck art per service card, swaps steel-on-fog → amber-on-navy on hover (no external images)
- [x] **Testimonial carousel** — prev/next arrows added, expanded 3 → 8 reviews with author + company
- [x] **Header** — added `mailto:info@autohausia.com` contact link (phone stays placeholder)
- [x] **Industries grid** — expanded 6 → 12 industries, responsive 4-col, hover accent
- [x] Dev server script bound to network (`next dev -H 0.0.0.0`), firewall rule for TCP 3000

## Project location
`C:\Users\user\Downloads\Dispatch web\autohausia-logistics-site\autohausia-logistics-site\`

## Next steps (not started)
- Set up `.env` (DATABASE_URL, NEXTAUTH_SECRET) and run `prisma migrate dev`
- Add real branding (colors, phone, email) per Autohausia's brand
- Create carrier accounts (bcrypt-hashed) via Prisma Studio
- Deploy to Vercel + Neon/Supabase
