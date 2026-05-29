# Petalcrumb Cake Studio

Concept portfolio project — a fictional boutique cake studio website. Built as a case study, **not** real client work. Always label the eventual deliverable as "concept project / fictional case study" in any portfolio writing.

@AGENTS.md

## Project at a glance

- **Type:** Full-stack lite — customer-facing catalog + order-request form, plus admin dashboard (login-gated CMS).
- **Ordering model:** Catalog + order-request form. **No** online payment, no shopping cart. Custom cakes get manually quoted.
- **Status:** FASE 4 (build) complete through M7 — public catalogue, order-request flow, admin CMS (auth + CRUD + image uploads), and polish/docs all shipped and deployed. Remaining work is incremental (see CASE-STUDY.md "next steps").
- **Fictional client:** "Petalcrumb Cake Studio", a boutique bakery in London (UK, GBP). See conversation memory for the full FASE 1 brief.

## Language rules (strict, ALWAYS apply)

Two distinct languages, kept strictly separate:

- **Conversation with the user: Bahasa Indonesia.** All explanations, questions, discussion to them in Indonesian.
- **Product artifacts: English, global, culturally-neutral — BY DEFAULT.** Everything that goes into the app/website is English: UI text, button labels, user-facing error messages, variable/function names, code comments, sample/dummy data, README, commit messages.
- Mixed artifacts (planning docs that describe a product): prose in Indonesian, but sample data + UI quotes + brand names in English.
- Default is **English/global** unless user explicitly says "make it for Indonesia / in Indonesian".

## User context (beginner mode)

The user is a coding beginner learning via Claude. Real name: Andre Huang. GitHub: `andrehuang13-eng`. Flexible schedule, no hard deadlines.

- Explain every technical term on first use in plain language.
- For terminal commands: give exact text + what it does + expected output.
- On errors: ask them to paste the message; explain cause + fix calmly.
- When you have terminal/file tools available (in Claude Code), **run diagnostic/routine commands yourself** rather than asking the user to type them. Reserve "user runs it" for commands needing admin/UAC, account login, or where typing is part of their learning (e.g., first `git push`).

## Autonomy mode (added 2026-05-28, M4.6)

Andre prefers **high-autonomy** operation. Run each milestone / sub-step end-to-end without pausing for per-step "go?" confirmations. When he says "run until done", run **all remaining milestones to completion in one continuous pass** — don't stop at milestone boundaries. He may leave the laptop unattended; keep working on unblocked items and queue any hard blocker rather than halting. Batch progress reports at milestone completion or at a hard blocker.

- Within a chunk, execute don't ask.
- Use background processes + programmatic verification (curl, CLI tools, scripts) instead of "go run X and tell me what you see".
- Pause only for: third-party signups (OAuth/ToS), CLI logins, UAC/admin ops, design decisions only the user can make, or explicit "pause/stop/tunggu".
- Onboarding pattern for future projects: at kickoff, collect all service API keys + target email addresses + confirm CLI logins in one go; then run autonomously.
- Full pattern in user-level memory: `user_autonomy_preference.md`.

## Stack

- **Next.js 16.2** (App Router, Server Components) — ⚠️ this version has breaking changes from older docs; consult `node_modules/next/dist/docs/` before writing framework-specific code.
- **React 19.2**
- **TypeScript 5**
- **Tailwind CSS v4** — new architecture, uses `@import "tailwindcss"` not `@tailwind` directives.
- **ESLint 9** (flat config)
- **Turbopack** for the dev server
- **npm** package manager
- **Vercel** for hosting (auto-deploy on `main` push)
- **GitHub** repo: `andrehuang13-eng/petalcrumb-cake-studio`

Planned additions (later milestones, do NOT add early):

- **M3:** Prisma + PostgreSQL via Neon (cake catalog from DB)
- **M4:** Resend for transactional email; Zod + React Hook Form
- **M5:** Admin auth — custom session (jose-signed JWT in an httpOnly cookie) + bcryptjs, credentials login. (Switched from the originally-planned Auth.js v5 to jose, following Next 16's official auth guide; next-auth v5 is still beta and Next 16 renamed middleware→proxy.) Route protection via `src/proxy.ts` (optimistic) + `requireAdmin()` DAL (authoritative).
- **M6:** ✅ Done — admin CMS (cakes/categories/FAQs/settings CRUD + order-requests inbox). Vercel Blob for image uploads. Built with hand-rolled Tailwind components instead of shadcn/ui (Tailwind v4 + existing design system).
- **M7:** ✅ Done — public pages wired to the CMS (FAQ/contact/footer from DB), error/loading/not-found states, skip-link + sitemap/robots, README + CASE-STUDY.md.

## Common commands

```bash
npm run dev      # Local dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve the production build locally (after build)
npm run lint     # ESLint check
```

## Conventions

**File structure:**

- `src/app/` — routes, layouts, pages (App Router convention)
- `src/components/` — reusable UI components (created as needed)
- `src/lib/` — utilities, helpers, server-side code (e.g., `db.ts`, `email.ts` later)
- `public/` — static assets (images, favicon)

**Imports:**

- Use the `@/*` alias for absolute imports from `src/` (e.g., `import { foo } from '@/lib/foo'`). Never use long relative paths like `../../../lib/foo`.

**Server vs Client Components:**

- Server Components by default (no directive).
- Add `"use client"` at the top of a file **only** when the component needs: state (`useState`), event handlers, hooks, or browser APIs.

**Code:**

- Commit messages: imperative, concise, English (e.g., `Add gallery page filter`, `Fix order date validation`).
- Money: store as integers in the smallest unit (e.g., `priceCents` in pence). Never floats.
- Form validation: Zod schemas, shared between client and server.
- Errors: graceful fallbacks; user-facing messages friendly + in English.

## What is OUT of scope for v1

(Don't add these without explicit user request; see the FASE 1 brief in conversation memory for full list and reasons.)

- Online payment / shopping cart / Stripe
- Customer accounts (no public login/signup)
- Real-time chat
- Multi-language, multi-currency
- SMS / WhatsApp notifications
- Reviews, ratings, blog, recipes
- Loyalty / promo codes
- Multiple admin roles
- Inventory tracking, delivery routing
- Calendar conflict-checking

## Workspace layout (Windows host)

```
D:\dev\
├── Git\                            ← portable Git for Windows (v2.54)
├── tools\nodejs\                   ← Node v24 LTS portable
└── projects\
    └── petalcrumb-cake-studio\     ← this project (cwd when working here)
```

## Frontend design

The `frontend-design` skill is installed at `~/.claude/skills/frontend-design/`. It encourages bold, distinctive aesthetic choices for UI work. When generating frontend components or pages, commit to a clear aesthetic direction (editorial, brutalist, soft-pastel, etc.) rather than defaulting to generic AI styling. Avoid clichés like Inter/Roboto fonts and purple-gradient-on-white backgrounds.
