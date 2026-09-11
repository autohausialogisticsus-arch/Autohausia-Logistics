# Autohausia Logistic LLC — Website

An original freight-dispatch marketing site with lead capture, built with
Next.js, Tailwind, and Prisma. Structured to match common dispatch-company
sites (home, services, FAQ, testimonials, contact, legal pages) — all
original code and content for you to brand and own.

## 1. Install

```bash
npm install
```

## 2. Set up your database (Supabase)

1. Create a free [Supabase](https://supabase.com) project (or use Neon/Railway).
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`.

   **Important — use the connection-pooler URL, not the direct URL.** In the
   Supabase dashboard go to *Project Settings → Database → Connection string →
   Transaction pooler* (port `6543`) and append the query params, e.g.:

   ```
   DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=3"
   ```

   This keeps serverless functions from exhausting connections.

3. Apply migrations (creates the `Lead`, `ApplicationDocument`, and `RateLimit` tables):
   ```bash
   npx prisma migrate deploy
   ```

## 3. Run locally

```bash
npm run dev
```
Visit http://localhost:3000

## 4. Add content

- **Testimonials / FAQs / Services**: currently hardcoded arrays in
  `components/Testimonials.tsx`, `FAQAccordion.tsx`, `ServicesGrid.tsx` —
  edit directly, or wire them to the `Testimonial` table later.
- **Leads**: submitted via the contact form, validated with Zod, and saved
  to the `Lead` table. View them with Prisma Studio
  (`npx prisma studio`).

## 5. Branding

Replace:
- "Autohausia Logistic LLC" in `components/Header.tsx`, `Footer.tsx`, `app/layout.tsx`
- Phone number in `Header.tsx`
- Colors in `tailwind.config.ts` (currently navy `#0B1220` + amber `#F2A71B`)
- Fonts in `app/layout.tsx` (currently Oswald + Inter + IBM Plex Mono)

## 6. Before you launch

- Have a lawyer draft or review your **Privacy Policy**, **Terms of
  Service**, and **Carrier Agreement** (`app/privacy`, `app/terms`,
  `app/carrier-agreement`) — these are placeholders and real legal
  documents, not boilerplate to copy from a competitor.
- If you plan to text leads, keep the SMS opt-in checkbox language in
  `ContactForm.tsx` — it's a TCPA compliance requirement, not decoration.

## 7. Deploy (Vercel + GitHub)

1. Push this repo to GitHub (`.env` is already git-ignored — never commit it).
2. Import the repo into [Vercel](https://vercel.com) — it auto-detects Next.js.
   The `vercel-build` script runs `prisma migrate deploy` automatically on each
   deploy to keep the database schema in sync.
3. Add every variable from `.env.example` in Vercel's
   *Project → Settings → Environment Variables*:
   - `DATABASE_URL` — the Supabase **pooler** URL (port 6543, `pgbouncer=true`)
   - `SITE_URL` — your Vercel domain (e.g. `https://yourdomain.com`)
   - `NEXT_PUBLIC_*` — business name, email, phone
   - `RESEND_*` / `APPLICATION_NOTIFY_TO` — email notifications
   - `S3_*` — document uploads (AWS, Cloudflare R2, or Supabase Storage)
4. Point your domain's DNS to Vercel.

> The site is **not** a static export — it uses server API routes
> (`/api/contact`, `/api/application`, `/api/application/upload-url`) for the
> forms. Deploying to a serverless host (Vercel) is required.

## 8. Admin dashboard (view leads)

Submissions from the contact form and carrier application are stored in the
`Lead` table. They can be viewed in the Supabase **Table Editor**, or on the
site itself at **`/admin`**:

1. Set a strong `ADMIN_PASSWORD` (8+ characters) in your Vercel env vars.
   Leave it empty to keep the dashboard disabled.
2. Visit `https://yourdomain.com/admin`, sign in with that password, and you'll
   see the 200 most recent leads with their uploaded documents (linked to
   storage). Use **Sign out** when done.

The dashboard is hidden from search engines and never linked in the site's
navigation.

## Project structure

```
app/
  page.tsx                     Home
  privacy/, terms/, carrier-agreement/   Legal pages
  api/contact/route.ts         Contact form handler
components/                    All UI sections
prisma/schema.prisma           Database models
lib/prisma.ts                  Prisma client singleton
```
