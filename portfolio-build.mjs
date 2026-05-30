// One-off: capture admin screenshots (auth-cookie injected) + build a
// portfolio PDF. Output: petalcrumb-portfolio.pdf at the project root.
//
// Run: node --env-file=.env portfolio-build.mjs
import puppeteer from "puppeteer-core";
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "https://petalcrumb-cake-studio.vercel.app";
const DOMAIN = "petalcrumb-cake-studio.vercel.app";
const ROOT = resolve(".").replaceAll("\\", "/");

// ----------------------------------------------------------------
// 1. Get admin + first cake from DB for cookie + edit-page URL
// ----------------------------------------------------------------
const prisma = new PrismaClient();
const admin = await prisma.admin.findFirst();
const firstCake = await prisma.cake.findFirst({
  where: { status: "PUBLISHED" },
  orderBy: { createdAt: "asc" },
});
await prisma.$disconnect();

if (!admin || !firstCake) {
  throw new Error("Need an admin + a published cake in the DB.");
}

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const sessionToken = await new SignJWT({
  adminId: admin.id,
  email: admin.email,
  name: admin.name,
})
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("1h")
  .sign(key);

// ----------------------------------------------------------------
// 2. Capture admin screenshots (1440 viewport, fullPage, light theme)
// ----------------------------------------------------------------
async function settleAndReveal(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll(".reveal, .rise-in")
      .forEach((el) => el.classList.add("is-in"));
  });
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(() =>
    window.scrollTo({ top: 0, behavior: "instant" }),
  );
  await new Promise((r) => setTimeout(r, 400));
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.createBrowserContext();
await ctx.setCookie(
  // admin session
  {
    name: "petalcrumb_session",
    value: sessionToken,
    domain: DOMAIN,
    path: "/",
  },
  // force light theme for the admin shots
  {
    name: "petalcrumb_theme",
    value: "light",
    domain: DOMAIN,
    path: "/",
  },
);

const ADMIN_PAGES = [
  ["admin-dashboard", "/admin"],
  ["admin-cakes", "/admin/cakes"],
  ["admin-cake-edit", `/admin/cakes/${firstCake.id}`],
  ["admin-requests", "/admin/requests"],
];
for (const [slug, path] of ADMIN_PAGES) {
  const page = await ctx.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + path, { waitUntil: "networkidle2" });
  await settleAndReveal(page);
  const out = `screenshots/${slug}.png`;
  await page.screenshot({ path: out, fullPage: true });
  console.log("OK", out);
  await page.close();
}
await ctx.close();
await browser.close();

// ----------------------------------------------------------------
// 3. Build HTML for PDF. Embed images as file:// URLs so the PDF
//    renderer can find them. Layout = A4 landscape.
// ----------------------------------------------------------------
const u = (file) => `file:///${ROOT}/screenshots/${file}`;
const has = (file) => existsSync(`screenshots/${file}`);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500&display=swap');

  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: 'Manrope', system-ui, sans-serif;
    color: #1f1a14;
    background: #faf6f0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 297mm; height: 210mm;
    padding: 18mm 22mm;
    page-break-after: always;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #faf6f0;
  }
  .page:last-child { page-break-after: auto; }

  /* Type */
  h1, h2, h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 500;
    color: #1f1a14;
    line-height: 1.05;
    letter-spacing: -0.01em;
  }
  h1 { font-size: 56pt; margin: 0 0 4mm; }
  h2 { font-size: 28pt; margin: 0 0 6mm; }
  h3 { font-size: 16pt; margin: 0 0 3mm; }
  p { font-size: 11pt; line-height: 1.55; color: #4a4138; margin: 0 0 3mm; }
  em.accent { color: #8e4f4a; font-style: italic; }
  .eyebrow {
    font-size: 8pt; letter-spacing: 0.3em; text-transform: uppercase;
    color: #b86f6a; margin: 0 0 4mm;
  }
  .meta {
    font-size: 8pt; letter-spacing: 0.2em; text-transform: uppercase;
    color: #8a8278;
  }

  /* Page chrome */
  .footer {
    position: absolute; left: 22mm; right: 22mm; bottom: 10mm;
    display: flex; justify-content: space-between;
    font-size: 8pt; letter-spacing: 0.18em; text-transform: uppercase;
    color: #8a8278;
    border-top: 1px solid #e5dccd;
    padding-top: 4mm;
  }

  /* Images */
  .shot {
    border: 1px solid #e5dccd;
    border-radius: 4px;
    overflow: hidden;
    background: #f4ece0;
    display: block;
  }
  .shot img {
    display: block; width: 100%; height: 100%;
    object-fit: cover; object-position: top center;
  }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; flex: 1; min-height: 0; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8mm; flex: 1; min-height: 0; }

  /* Cover-specific */
  .cover {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 14mm;
    align-items: center;
  }
  .cover .hero img {
    width: 100%; height: 165mm;
    object-fit: cover; object-position: top center;
    border: 1px solid #e5dccd; border-radius: 6px;
  }
  .cover h1 { font-size: 64pt; }
  .cover .lede {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 18pt; color: #4a4138;
    line-height: 1.25; margin: 8mm 0 12mm;
  }
  .cover .links { font-size: 10pt; line-height: 1.7; color: #4a4138; }
  .cover .links a { color: #8e4f4a; text-decoration: none; }

  /* At-a-glance */
  .glance-grid {
    display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 12mm;
    flex: 1; align-content: start;
  }
  .glance-grid h3 { margin-top: 6mm; }
  .glance-grid h3:first-child { margin-top: 0; }
  .glance-grid p { font-size: 10.5pt; }
  .stack-list { font-size: 10pt; line-height: 1.7; color: #4a4138; }

  /* Admin section caption */
  .caption {
    font-size: 9pt; color: #8a8278; margin-top: 3mm; text-align: center;
    letter-spacing: 0.08em;
  }
`;

const PAGES = [
  // ---------- 1. Cover ----------
  {
    title: "Cover",
    html: `
      <div class="cover" style="flex: 1;">
        <div>
          <div class="eyebrow">Portfolio Case Study</div>
          <h1>Petalcrumb</h1>
          <h1 style="font-style: italic; color: #8e4f4a; font-size: 32pt; margin-top: -2mm;">Cake Studio</h1>
          <p class="lede">Bespoke celebration cakes, hand-finished in London — built end-to-end as a full-stack portfolio case study.</p>
          <div class="links">
            <strong style="color:#1f1a14">Live</strong> · <a href="${BASE}">${BASE.replace("https://", "")}</a><br/>
            <strong style="color:#1f1a14">Code</strong> · <a href="https://github.com/andrehuang13-eng/petalcrumb-cake-studio">github.com/andrehuang13-eng/petalcrumb-cake-studio</a><br/><br/>
            <span class="meta">Andre Huang · 2026 · Concept project</span>
          </div>
        </div>
        <div class="hero shot"><img src="${u("home-desktop.png")}" /></div>
      </div>
    `,
  },

  // ---------- 2. At a glance ----------
  {
    title: "At a glance",
    html: `
      <div class="eyebrow">01 · At a glance</div>
      <h2>End-to-end full-stack — built and deployed.</h2>
      <div class="glance-grid">
        <div>
          <h3>What it is</h3>
          <p>A complete website for a fictional boutique cake studio: a database-driven customer catalogue, a structured enquiry flow with email notifications, and a login-gated admin CMS the owner can use to manage every piece of content.</p>
          <h3>My role</h3>
          <p>Solo full-stack developer — product framing, UI design system, backend, database schema, auth, deployment, observability.</p>
          <h3>Why concept</h3>
          <p>No real client. I drew up an imaginary brief with realistic constraints and treated the build as if a real bakery owner had hired me, so every decision had to justify itself.</p>
        </div>
        <div>
          <h3>Stack</h3>
          <div class="stack-list">
            <strong style="color:#1f1a14">Framework</strong> · Next.js 16 (App Router, RSC, Server Actions)<br/>
            <strong style="color:#1f1a14">Language</strong> · TypeScript, React 19<br/>
            <strong style="color:#1f1a14">Data</strong> · Prisma + PostgreSQL (Neon)<br/>
            <strong style="color:#1f1a14">Styling</strong> · Tailwind v4 · light + dark mode<br/>
            <strong style="color:#1f1a14">Auth</strong> · jose JWT + bcryptjs (custom session)<br/>
            <strong style="color:#1f1a14">Validation</strong> · Zod (shared client + server)<br/>
            <strong style="color:#1f1a14">Email</strong> · Resend<br/>
            <strong style="color:#1f1a14">Storage</strong> · Vercel Blob (image uploads)<br/>
            <strong style="color:#1f1a14">Host</strong> · Vercel (CI auto-deploy on push)
          </div>
        </div>
      </div>
    `,
  },

  // ---------- 3. Public — desktop ----------
  {
    title: "Public — desktop",
    html: `
      <div class="eyebrow">02 · Customer-facing site</div>
      <h2>Editorial design, served from the database.</h2>
      <p style="max-width: 200mm;">Catalogue + cake detail + enquiry flow all render from PostgreSQL. The "Request this design" CTA pre-fills the form with the visited cake.</p>
      <div class="grid-3" style="margin-top: 6mm;">
        <div class="shot"><img src="${u("home-desktop.png")}" /></div>
        <div class="shot"><img src="${u("gallery-desktop.png")}" /></div>
        <div class="shot"><img src="${u("cake-detail-desktop.png")}" /></div>
      </div>
    `,
  },

  // ---------- 4. Light + Dark ----------
  {
    title: "Light + Dark",
    html: `
      <div class="eyebrow">03 · Adaptive design</div>
      <h2>Same design system, <em class="accent">two palettes</em>.</h2>
      <p style="max-width: 200mm;">Implemented via CSS variable swap on a single <code style="font-family: monospace; font-size: 10pt;">.dark</code> class — zero markup changes between modes. Persisted via cookie + system-preference fallback, FOUC-free.</p>
      <div class="grid-2" style="margin-top: 6mm;">
        <div class="shot"><img src="${u("home-desktop.png")}" /></div>
        <div class="shot"><img src="${u("home-desktop-dark.png")}" /></div>
      </div>
    `,
  },

  // ---------- 5. Mobile ----------
  {
    title: "Mobile",
    html: `
      <div class="eyebrow">04 · Responsive</div>
      <h2>Same care on small screens.</h2>
      <p style="max-width: 200mm;">Single column, hamburger menu, full-width cards. Mobile gets every real photo, the marquee, and the form, exactly as desktop does.</p>
      <div class="grid-3" style="margin-top: 6mm;">
        <div class="shot" style="max-height: 130mm;"><img src="${u("home-mobile.png")}" style="object-position: top center;" /></div>
        <div class="shot" style="max-height: 130mm;"><img src="${u("gallery-mobile.png")}" style="object-position: top center;" /></div>
        <div class="shot" style="max-height: 130mm;"><img src="${u("request-mobile.png")}" style="object-position: top center;" /></div>
      </div>
    `,
  },

  // ---------- 6. Admin CMS overview ----------
  {
    title: "Admin CMS",
    html: `
      <div class="eyebrow">05 · Custom admin CMS</div>
      <h2>The owner runs everything — without touching code.</h2>
      <p style="max-width: 200mm;">Login-gated dashboard with full CRUD for cakes (with image uploads), categories, FAQs, settings, and an order-request inbox with status triage.</p>
      <div class="grid-2" style="margin-top: 6mm;">
        <div class="shot"><img src="${has("admin-dashboard.png") ? u("admin-dashboard.png") : u("home-desktop.png")}" /></div>
        <div class="shot"><img src="${has("admin-cakes.png") ? u("admin-cakes.png") : u("gallery-desktop.png")}" /></div>
      </div>
    `,
  },

  // ---------- 7. Admin cake editor ----------
  {
    title: "Admin — Cake editor",
    html: `
      <div class="eyebrow">06 · Cake editor</div>
      <h2>Real workflow: core fields, sizes, flavours, images.</h2>
      <p style="max-width: 200mm;">One form combines all data points. Images upload to Vercel Blob (or paste an external URL). Sizes are an inline sub-form. Delete is guarded — categories with referenced cakes won't delete.</p>
      <div class="shot" style="margin-top: 5mm; max-height: 130mm;"><img src="${has("admin-cake-edit.png") ? u("admin-cake-edit.png") : u("cake-detail-desktop.png")}" /></div>
    `,
  },

  // ---------- 8. Engineering notes ----------
  {
    title: "Engineering notes",
    html: `
      <div class="eyebrow">07 · Engineering notes</div>
      <h2>Decisions worth calling out.</h2>
      <div class="glance-grid" style="grid-template-columns: 1fr 1fr; gap: 14mm;">
        <div>
          <h3>Auth without a library</h3>
          <p>jose-signed JWT in an httpOnly cookie, bcryptjs hashes. Built per Next 16's own auth guide — chose this over Auth.js v5 because v5 was still beta and Next 16 renamed middleware to proxy.</p>
          <h3>One Zod schema for both sides</h3>
          <p>The order form validates with the same schema on client (React Hook Form) and server (Server Action). Drift is impossible by construction.</p>
        </div>
        <div>
          <h3>Email survives serverless</h3>
          <p>Resend send is awaited inside the action so it actually delivers — the original fire-and-forget was killed by function freeze. Failures are swallowed and logged so the user never sees them.</p>
          <h3>Vercel build is reproducible</h3>
          <p>postinstall: prisma generate fixes the stale-client cache trap after schema changes. Blob host is allowlisted in next.config. Dynamic OG + Twitter image generated by next/og.</p>
        </div>
      </div>
    `,
  },
];

const html = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Petalcrumb · Case Study</title>
<style>${css}</style></head>
<body>
${PAGES.map(
  (p, i) => `
  <div class="page">
    ${p.html}
    <div class="footer">
      <span>Petalcrumb Cake Studio · Case study</span>
      <span>${String(i + 1).padStart(2, "0")} / ${String(PAGES.length).padStart(2, "0")}</span>
    </div>
  </div>`,
).join("\n")}
</body></html>`;

writeFileSync("portfolio.html", html);
console.log("Wrote portfolio.html");

// ----------------------------------------------------------------
// 4. Render HTML → PDF
// ----------------------------------------------------------------
const browser2 = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--allow-file-access-from-files"],
});
const page = await browser2.newPage();
await page.goto(`file:///${ROOT}/portfolio.html`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 800)); // settle webfonts
await page.pdf({
  path: "petalcrumb-portfolio.pdf",
  width: "297mm",
  height: "210mm",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});
await browser2.close();
console.log("Wrote petalcrumb-portfolio.pdf");
