import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://petalcrumb-cake-studio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cakes = await prisma.cake.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/gallery",
    "/about",
    "/faq",
    "/contact",
    "/request-a-cake",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const cakeRoutes: MetadataRoute.Sitemap = cakes.map((c) => ({
    url: `${BASE}/cakes/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...cakeRoutes];
}
