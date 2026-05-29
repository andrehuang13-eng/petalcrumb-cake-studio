# Petalcrumb Cake Studio

A full-stack website for a fictional boutique cake studio in London — a **concept portfolio project**, not a real business. It pairs a polished, editorial customer-facing catalogue with a login-gated admin CMS.

**Live:** https://petalcrumb-cake-studio.vercel.app

> Petalcrumb is an invented brand built as a case study. See [CASE-STUDY.md](./CASE-STUDY.md) for the design and engineering write-up.

## What it does

**Public site**

- Editorial homepage and **About / FAQ / Contact** pages
- **Gallery** of cakes with category filtering, rendered from the database
- **Cake detail** pages with sizes, flavours, lead time, and allergens
- **Request-a-cake** form (no cart, no payment) — the studio quotes each cake by hand. Submissions are validated, saved, and emailed to the studio.

**Admin CMS** (`/admin`, login-gated)

- **Dashboard** with live counts
- **Order requests** inbox — filter, triage status, private notes
- **Cakes** — full CRUD, image upload (Vercel Blob) or by URL, size options, flavours, draft/published status, featured flag
- **Categories**, **FAQs**, and **site settings** management
- Contact details and FAQs edited here drive the public site

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) on **React 19**
- **TypeScript** + **Tailwind CSS v4** (custom "Editorial Boutique" design system)
- **Prisma 6** + **PostgreSQL** (Neon)
- **Auth** — custom session: `jose`-signed JWT in an httpOnly cookie + `bcryptjs` (following Next 16's official auth guide)
- **Resend** for transactional email; **Zod** + **React Hook Form** for validation
- **Vercel Blob** for image uploads
- Hosted on **Vercel** (auto-deploy on push to `main`)

## Getting started

See **[SETUP.md](./SETUP.md)** for full setup. In short:

```bash
npm install
cp .env.example .env    # fill in DATABASE_URL, DIRECT_URL, RESEND_API_KEY, etc.
npx prisma generate
npm run db:migrate      # apply migrations
npm run db:seed         # sample catalogue
npm run db:create-admin # ADMIN_EMAIL=… ADMIN_PASSWORD=… to create the admin login
npm run dev
```

Open http://localhost:3000 (public) or http://localhost:3000/admin (CMS).

## Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection (runtime queries) |
| `DIRECT_URL` | Neon direct connection (migrations) |
| `SESSION_SECRET` | Signs admin session JWTs |
| `RESEND_API_KEY` | Sends order-request notification emails |
| `ORDER_REQUEST_TO_EMAIL` | Where order notifications are delivered |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob image uploads |

`.env` is gitignored; `.env.example` is the committed template.

## Scripts

```bash
npm run dev            # local dev server (Turbopack)
npm run build          # production build
npm run start          # serve the production build
npm run lint           # ESLint
npm run db:migrate     # create + apply a Prisma migration
npm run db:seed        # seed sample data
npm run db:studio      # Prisma Studio (browse data)
npm run db:create-admin # create/reset the admin user
```

## Project structure

```
src/
├── app/
│   ├── (public pages)        # /, gallery, cakes/[slug], about, faq, contact
│   ├── request-a-cake/       # order form + server action
│   └── admin/                # login + (dashboard) CMS, protected
├── components/               # shared + admin UI
├── lib/                      # prisma, session/dal (auth), email, settings, validators
└── proxy.ts                  # route protection (Next 16 "proxy" = middleware)
prisma/                       # schema, migrations, seed, create-admin
```

## Status

Concept portfolio project — built as a case study, not a real client engagement. Not a real business; no real orders are taken.
