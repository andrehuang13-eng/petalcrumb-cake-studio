# Case study — Petalcrumb Cake Studio

> A concept portfolio project: a full-stack website for a **fictional** boutique cake studio in London. No real client, no real business. Built to demonstrate end-to-end product thinking and modern full-stack engineering.

**Live:** https://petalcrumb-cake-studio.vercel.app · **Code:** this repository

---

## The brief

Petalcrumb is an invented boutique bakery in Hackney, London, specialising in pressed-flower wedding cakes and sculpted celebration cakes. The studio is tiny — a few cakes a week, all bespoke — so the website's job is **not** to sell off-the-shelf products. It's to:

1. Showcase the work beautifully, and
2. Turn interest into a **well-qualified enquiry** the studio can quote by hand.

That single insight shaped every scoping decision.

## Goals & constraints

- **Ordering model:** a browsable catalogue plus a structured *request-a-cake* form. **No shopping cart, no online payment, no customer accounts.** Custom cakes are quoted individually.
- **One admin.** A single studio owner manages everything through a login-gated CMS — no multi-role permissions.
- **Allergen-aware** content, GBP pricing, UK English, culturally neutral.
- **Out of scope (deliberately):** payments/Stripe, public sign-up, reviews, blog, multi-language/currency, SMS/WhatsApp, loyalty, inventory, delivery routing. Keeping these out kept v1 focused on the conversion path that matters.

## Information architecture

- **Public:** Home · Gallery (filterable) · Cake detail · About · FAQ · Contact · Request a cake
- **Admin (`/admin`):** Dashboard · Requests inbox · Cakes · Categories · FAQs · Settings

The request form is the conversion point; every "Request this design" CTA pre-fills it with the cake the visitor was viewing.

## Design direction — "Editorial Boutique"

A deliberately un-generic aesthetic: warm cream canvas, ink text, a single rose accent, and a **Fraunces** display serif paired with **Manrope** for body. Small-caps eyebrows, generous whitespace, and restrained motion give it a print-editorial feel rather than a templated-SaaS look. The admin reuses the same palette so the whole product feels like one brand.

## Architecture & key decisions

**Stack:** Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript, Tailwind v4, Prisma + PostgreSQL (Neon), Resend, Vercel Blob, hosted on Vercel.

A few decisions worth calling out, because the *why* matters more than the *what*:

- **Money as integers.** Prices are stored in pence (`priceCents`), never floats — the standard guard against rounding bugs.
- **Validation shared client ↔ server.** One Zod schema powers both the React Hook Form UX and the server-side re-validation, so the two can never drift. Server Actions always re-validate; client validation is only UX.
- **Auth: rolled on `jose`, not a library.** The plan called for Auth.js v5, but Next 16 renamed Middleware → **Proxy** (now Node-runtime) and Auth.js v5 was still beta. Following Next 16's *own* official auth guide, I implemented a small, well-understood session layer instead: a `jose`-signed JWT in an httpOnly cookie, `bcryptjs` password hashing, an optimistic check in `proxy.ts`, and an authoritative `requireAdmin()` data-access layer used by every admin page and action. Fewer moving parts, zero framework-version risk.
- **Admin UI hand-built, not shadcn/ui.** With Tailwind v4 and an existing custom design system, hand-rolled components kept the admin visually consistent with the site and avoided integration friction.
- **Email is best-effort but reliable.** Order requests are saved to the database first (the source of truth), then a Resend notification is sent. The send is **awaited** inside the Server Action — on serverless, un-awaited "fire-and-forget" work is killed when the function freezes, so a naive version silently dropped emails in production. A failed email never fails the customer's submission.

## Challenges solved

- **Serverless email drop.** Real submissions weren't emailing in production while local worked. Root cause: fire-and-forget after the response. Fix: await the send; swallow + log failures so the DB write still succeeds. *(Caught by testing on production, not just locally.)*
- **Prisma client stale on Vercel.** The first deploy after adding a model failed type-checking because Vercel restored a cached `node_modules` with an out-of-date generated client. Fix: `postinstall: prisma generate`, which also fixes fresh clones.
- **Next 16 breaking changes.** Middleware became `proxy.ts`; the codebase follows the new conventions rather than fighting them.

## Outcome

A complete, deployed product: a catalogue rendered from a real database, a validated enquiry flow that emails the studio, and a full CMS where one person can manage cakes (with image uploads), categories, FAQs, contact details, and incoming requests — all behind authentication, all auto-deployed on push.

## If this were a real engagement — next steps

- Calendar/availability checks to prevent double-booking busy weekends
- Image optimisation pipeline + alt-text guidance for the admin
- Audit log + password reset/2FA for the admin
- Automated tests (request flow, auth) and a Lighthouse budget in CI
- Customer-facing status updates on a quote (without building a full account system)

---

*Petalcrumb Cake Studio is a fictional brand created for portfolio purposes.*
