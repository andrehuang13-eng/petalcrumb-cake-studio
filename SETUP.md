# Local setup

How to clone this project to a new machine and run it locally.

This is a concept portfolio project, not real client work. Built on Next.js 16 + TypeScript + Tailwind v4 + Prisma 6 + PostgreSQL (Neon) + Vercel.

## Prerequisites

You need these installed (one-time per machine):

- **Node.js 22+ LTS** ([nodejs.org](https://nodejs.org)) — runtime
- **Git** ([git-scm.com](https://git-scm.com)) — version control
- A **GitHub account** with access to the repo
- A **Neon account** (or the database credentials from the project owner)

Verify in PowerShell / terminal:

```bash
node -v          # should print v22.x.x or higher
npm -v           # should print 10.x.x or higher
git --version    # should print 2.40+ or higher
```

If git identity is not yet set globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Clone and install

```bash
git clone https://github.com/andrehuang13-eng/petalcrumb-cake-studio.git
cd petalcrumb-cake-studio
npm install
```

`npm install` downloads ~400 MB of dependencies into `node_modules/`.

## Database credentials

The app needs two environment variables: `DATABASE_URL` (for runtime queries) and `DIRECT_URL` (for Prisma migrations). Both point to a PostgreSQL database hosted on Neon.

Create a file named `.env` at the project root with:

```
DATABASE_URL="postgresql://user:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require"
```

- `DATABASE_URL` uses the **pooled** connection (hostname contains `-pooler`)
- `DIRECT_URL` uses the **direct** connection (hostname does NOT contain `-pooler`)
- Both point to the same database, just different connection routes

To get these values:

1. Log in to [neon.tech](https://neon.tech)
2. Open the project (e.g. `petalcrumb-cake-studio`)
3. Find the connection string in the dashboard
4. The default shown is usually the pooled one; the direct version is the same URL with `-pooler` removed from the hostname

`.env` is gitignored (never committed). `.env.example` (committed) shows the template.

## Generate Prisma client

After `.env` exists, generate the typed Prisma client:

```bash
npx prisma generate
```

## Run the dev server

```bash
npm run dev
```

Opens on [http://localhost:3000](http://localhost:3000). Hot reload is enabled — saves to source files refresh the browser automatically.

## Other commands

```bash
npm run build         # production build (also runs in Vercel)
npm run start         # serve the production build locally
npm run lint          # ESLint check
npm run db:migrate    # run Prisma migrations (creates SQL + applies to DB)
npm run db:seed       # seed the database with sample data
npm run db:studio     # open Prisma Studio (GUI to browse data)
```

## Project structure

```
petalcrumb-cake-studio/
├── prisma/
│   ├── schema.prisma          # database schema
│   ├── migrations/            # SQL migrations
│   └── seed.ts                # seed data (8 cakes, 5 categories, 6 FAQs)
├── public/                    # static assets
├── src/
│   ├── app/                   # Next.js App Router (routes, layouts)
│   ├── components/            # reusable React components
│   └── lib/
│       └── prisma.ts          # singleton Prisma client
├── .env                       # local secrets (gitignored)
├── .env.example               # secrets template (committed)
├── CLAUDE.md                  # project context for AI tools (rules, stack, conventions)
├── AGENTS.md                  # additional AI agent notes
└── SETUP.md                   # this file
```

## Troubleshooting

**`npm: cannot be loaded because running scripts is disabled` (Windows PowerShell)**

Run once:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

**`fatal: unable to access ... schannel: server closed abruptly` (git push/clone)**

Git for Windows has a known issue with TLS connections. Apply:
```bash
git config --global http.version HTTP/1.1
git config --global http.postBuffer 524288000
git config --global http.schannelCheckRevoke false
```

**`Failed to fetch font from Google Fonts` during build**

This project uses `@fontsource` packages instead of `next/font/google` to avoid runtime Google Fonts fetch issues. Fonts are bundled in `node_modules/@fontsource-variable/`. If install was incomplete, run `npm install` again.

**`Environment variable not found: DATABASE_URL`**

Make sure `.env` exists at the project root and contains both `DATABASE_URL` and `DIRECT_URL`.

## Deployment

The `main` branch auto-deploys to Vercel on push. Production URL: configured per project. Environment variables (`DATABASE_URL`, `DIRECT_URL`) must be set in Vercel dashboard separately from the local `.env`.

## Status

This is a concept project built as a portfolio case study. It is not a real business. See [CLAUDE.md](./CLAUDE.md) for project rules, stack details, and conventions.
