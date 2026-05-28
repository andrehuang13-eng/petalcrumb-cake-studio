# Petalcrumb Cake Studio

Concept portfolio project — a fictional boutique cake studio website. Built as a case study, **not** real client work. Always label the eventual deliverable as "concept project / fictional case study" in any portfolio writing.

@AGENTS.md

## Project at a glance

- **Type:** Full-stack lite — customer-facing catalog + order-request form, plus admin dashboard (login-gated CMS).
- **Ordering model:** Catalog + order-request form. **No** online payment, no shopping cart. Custom cakes get manually quoted.
- **Status:** Currently in FASE 4 (build), following a phased plan (FASE 1 brief → 2 tech plan → 3 setup → 4 build).
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
- One small step at a time; wait for confirmation before the next.
- For terminal commands: give exact text + what it does + expected output.
- Don't dump many commands at once.
- On errors: ask them to paste the message; explain cause + fix calmly.
- When you have terminal/file tools available (in Claude Code), **run diagnostic/routine commands yourself** rather than asking the user to type them. Reserve "user runs it" for commands needing admin/UAC, account login, or where typing is part of their learning (e.g., first `git push`).

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
- **M5:** Auth.js v5 (Credentials provider) + bcrypt
- **M6:** Vercel Blob (image uploads); shadcn/ui (admin UI components)
- **M7:** Polish, accessibility, Lighthouse targets, README, case-study draft

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
