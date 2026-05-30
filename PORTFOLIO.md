# Portfolio kit — Petalcrumb Cake Studio

Panduan + teks siap-pakai untuk memajang proyek ini di **Upwork** dan **Fiverr**.
Teks dalam blok kode bahasa Inggris sudah siap copy-paste (platform-nya global).
Penjelasan di luar blok dalam bahasa Indonesia (catatan untukmu).

**Live:** https://petalcrumb-cake-studio.vercel.app
**Repo:** https://github.com/andrehuang13-eng/petalcrumb-cake-studio

> ⚠️ Selalu sebut ini **concept / fictional case study**, bukan klien nyata. Ini jujur dan justru terlihat profesional — banyak developer bagus punya concept project di portofolio.

---

## 1) Upwork — Portfolio item

Upwork punya bagian **Portfolio** di profil. Buat 1 item baru:

**Title:**
```
Petalcrumb — Full-Stack Bakery Website with Custom CMS (Next.js 16)
```

**Role:** `Full-Stack Developer` · **Completed:** 2026

**Description (paste):**
```
A full-stack website for a boutique cake studio: a polished customer-facing
catalogue plus a login-gated admin CMS. Built as a self-directed case study to
demonstrate end-to-end product engineering.

Customers browse a database-driven gallery, view cake details, and submit a
structured "request a cake" enquiry (no cart/checkout — bespoke cakes are
quoted by hand). Each submission is validated, saved, and emailed to the studio.

The owner manages everything from a custom admin dashboard: full CRUD for
cakes (with image upload), categories, FAQs, and site settings, plus an
order-request inbox with status triage — all behind authentication.

Highlights
• Next.js 16 (App Router, Server Components, Server Actions) + React 19 + TypeScript
• PostgreSQL + Prisma; transactional email (Resend); image uploads (Vercel Blob)
• Custom session auth (JWT in httpOnly cookie + bcrypt) — no heavyweight library
• Zod validation shared between client and server
• Editorial design system with light + dark mode (CSS-variable token swap,
  zero markup churn), subtle page transitions, motion-aware reveals
• Responsive, accessible (skip links, prefers-reduced-motion), SEO (dynamic
  OG images, sitemap/robots), Vercel Analytics + Speed Insights
• Anti-spam (honeypot + timing) and per-IP rate limits on public + admin forms
• Deployed on Vercel with CI auto-deploy

Note: Petalcrumb is a fictional brand created for this case study.
```

**Skills tags:** `Next.js`, `React`, `TypeScript`, `Node.js`, `PostgreSQL`, `Prisma`, `Tailwind CSS`, `Full-Stack Development`, `Web Design`, `CMS`

**Tips Upwork:**
- Upload 3–5 screenshot (lihat bagian 4). Gambar pertama = homepage hero (paling menjual).
- Di "Project URL" taruh link live-nya.
- Setelah ada 1–2 portfolio item, profil terasa jauh lebih kredibel.

---

## 2) Fiverr — Gig

Di Fiverr kamu jual **layanan**, jadi framing-nya beda: proyek ini jadi **bukti** kemampuan di sebuah gig.

**Gig title (paste):**
```
I will build a modern full-stack website with an admin dashboard in Next.js
```

**Category:** Programming & Tech → Website Development → Full Stack

**Search tags:** `nextjs`, `react`, `full stack`, `web app`, `admin dashboard`, `typescript`

**Gig description (paste):**
```
Looking for a fast, modern website that you can actually manage yourself?
I build full-stack websites in Next.js with a clean, custom admin dashboard —
no clunky page builders, no monthly platform lock-in.

What you get:
• A polished, responsive, fast website (Next.js + React + TypeScript)
• A custom admin panel to manage your content (products, pages, enquiries…)
• Database + contact/enquiry forms wired to email
• Image uploads, SEO basics, and deployment to a live URL
• Optional dark mode, page transitions, and other modern touches

See a complete example I built end-to-end (concept project):
petalcrumb-cake-studio.vercel.app — a boutique cake studio with a public
catalogue and a full login-gated CMS.

Tell me about your business and I'll recommend the right setup. Clear
communication, clean code, and a site you own.
```

**Packages (contoh struktur):**
| | Basic | Standard | Premium |
|---|---|---|---|
| Scope | Landing + contact form | Multi-page + CMS | Full app + admin dashboard |
| Pages | up to 3 | up to 6 | 6+ + admin |
| Admin panel | — | basic | full CRUD |
| Delivery | 5 days | 10 days | 21 days |

> Angka di atas contoh — sesuaikan dengan kecepatan & harga yang kamu nyaman.

**Gig FAQ (paste):**
```
Q: Is the example site a real business?
A: No — Petalcrumb is a concept project I built to showcase the full stack
(public site + database + admin CMS + email + auth + deployment).

Q: Will I be able to update the site myself?
A: Yes. Every project includes an admin dashboard so you can manage content
without touching code.

Q: What tech do you use?
A: Next.js, React, TypeScript, PostgreSQL/Prisma, deployed on Vercel.
```

---

## 3) Cara publish (langkah singkat)

**Upwork:**
1. Login → klik foto profil → **Profile**.
2. Scroll ke **Portfolio** → **+** (Add a project).
3. Isi Title + Description (teks di atas), upload screenshot, isi Project URL.
4. Save.

**Fiverr:**
1. Login → **Switch to Selling** → **Gigs** → **Create a new Gig**.
2. Overview: title + category + tags (di atas).
3. Pricing: isi paket. Description & FAQ: paste teks di atas.
4. Gallery: upload screenshot (wajib minimal 1; idealnya 3 + 1 video kalau bisa).
5. Publish.

---

## 4) Screenshot yang sebaiknya diambil

Ambil dari situs live. Cara paling gampang & HD:
1. Buka halaman di Chrome.
2. Tekan **F12** → klik ikon **device toolbar** (Ctrl+Shift+M) → pilih "Responsive", set lebar **1440**.
3. Menu **⋮** (di panel device) → **Capture screenshot** (atau "Capture full size screenshot" untuk full halaman).

Halaman yang paling menjual (urut prioritas):
1. **Homepage** (hero + gambar kue) — gambar utama portfolio.
2. **Gallery** (grid kue) — nunjukin data dari DB.
3. **Cake detail** (mis. `/cakes/pressed-petal`) — layout + harga + sizes.
4. **Request a cake** (form) — fitur enquiry.
5. **Admin dashboard** + **Admin → Cakes** (login dulu) — nilai jual utama: CMS.
6. (Opsional) tampilan **mobile** homepage — bukti responsif.

> Untuk screenshot admin: login di `/admin` dulu, baru capture. Jangan tampilkan password di screenshot.

---

## 5) Satu kalimat pitch (kalau butuh cepat)

```
Full-stack Next.js website + custom admin CMS for a boutique cake studio —
catalogue, enquiry flow, image uploads, auth, and email, deployed on Vercel.
```
