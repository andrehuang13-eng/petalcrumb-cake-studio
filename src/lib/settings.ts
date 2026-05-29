import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type SiteSettingsView = {
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
};

// Fallbacks so the public site renders even before the singleton is saved.
const DEFAULTS: SiteSettingsView = {
  email: "hello@petalcrumb.studio",
  phone: "+44 20 7946 0000",
  address: "12 Marlowe Lane, Hackney, London E8 3FY",
  openingHours: "Tuesday–Saturday, 9am–5pm",
  instagramUrl: "https://instagram.com/petalcrumb.studio",
};

export const getSiteSettings = cache(async (): Promise<SiteSettingsView> => {
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) return DEFAULTS;
  return {
    email: s.email,
    phone: s.phone,
    address: s.address,
    openingHours: s.openingHours,
    instagramUrl: s.instagramUrl,
  };
});

// "https://instagram.com/petalcrumb.studio" → "@petalcrumb.studio"
export function instagramHandle(url: string): string | null {
  if (!url) return null;
  const seg = url.replace(/\/+$/, "").split("/").pop();
  return seg ? `@${seg}` : null;
}
