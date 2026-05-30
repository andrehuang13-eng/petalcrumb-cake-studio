// One-off: replace placeholder cake images with real, name-matched HD photos.
//
// Source: Wikimedia Commons (keyless API, real photographs with known
// dimensions and permissive licensing — appropriate for a portfolio piece).
// Each chosen image is downloaded, validated (JPEG magic bytes + min size),
// then re-uploaded to Vercel Blob — a host we control and have allowlisted in
// next.config — so the public URLs are permanent and never hotlink-break.
//
// Run: node --env-file=.env prisma/replace-images.mjs
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { writeFileSync } from "node:fs";

const UA = {
  "User-Agent":
    "PetalcrumbPortfolio/1.0 (concept portfolio; andrehuang13@gmail.com)",
};

// slug -> ordered search queries (first candidate that validates wins).
// Keyed by the REAL cake slugs, matched to each cake's actual description.
// pressed-petal is intentionally omitted — it already has a real photo.
const PLAN = {
  "confetti-dream": ["funfetti cake sprinkles", "colorful birthday cake", "rainbow birthday cake"],
  "velvet-crown": ["red velvet cake", "red velvet cake slice"],
  "little-cloud": ["pastel pink celebration cake", "pastel cake", "pink birthday cake"],
  "honeycomb-hive": ["salted caramel honey cake", "honey cake caramel", "honey cake"],
  "safari-storybook": ["fondant animal birthday cake", "childrens novelty cake", "animal cake fondant"],
  "anniversary-bloom": ["buttercream rose wedding cake", "pink wedding cake roses", "wedding cake roses"],
  "coffee-cardamom-cupcakes": ["coffee cupcake", "cupcakes buttercream", "cupcakes"],
};

async function searchCommons(q) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrnamespace=6&gsrsearch=" +
    encodeURIComponent("filetype:bitmap " + q) +
    "&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1600&format=json&origin=*";
  const r = await fetch(url, { headers: UA });
  if (r.status !== 200) return [];
  const j = await r.json();
  return Object.values(j.query?.pages || {})
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((i) => i.mime === "image/jpeg" && i.width >= 1100 && i.height >= 850)
    .sort((a, b) => b.width * b.height - a.width * a.height);
}

async function fetchValidJpeg(u) {
  try {
    const r = await fetch(u, { headers: UA });
    if (!r.ok) return null;
    if (!(r.headers.get("content-type") || "").startsWith("image/")) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 30000) return null; // too small to be HD
    if (!(buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)) return null; // JPEG
    return buf;
  } catch {
    return null;
  }
}

const prisma = new PrismaClient();
const used = new Set();
const report = [];

for (const [slug, queries] of Object.entries(PLAN)) {
  const cake = await prisma.cake.findUnique({
    where: { slug },
    select: { id: true, title: true },
  });
  if (!cake) {
    report.push(`SKIP ${slug} (no such cake)`);
    continue;
  }

  let done = false;
  for (const q of queries) {
    if (done) break;
    for (const cand of await searchCommons(q)) {
      const src = cand.thumburl || cand.url;
      if (used.has(src)) continue;
      const buf = await fetchValidJpeg(src);
      if (!buf) continue;

      const blob = await put(`cakes/${slug}.jpg`, buf, {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: true,
        allowOverwrite: true,
      });
      await prisma.cakeImage.updateMany({
        where: { cakeId: cake.id, isPrimary: true },
        data: { url: blob.url, altText: cake.title },
      });

      used.add(src);
      report.push(
        `OK   ${slug.padEnd(26)} [${q}] ${cand.width}x${cand.height} ${src.split("/").pop()}`,
      );
      done = true;
      break;
    }
  }
  if (!done) report.push(`FAIL ${slug.padEnd(26)} (no valid candidate)`);
}

await prisma.$disconnect();
writeFileSync("image-replace-report.txt", report.join("\n"));
console.log(report.join("\n"));
