import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SITE_URL = "https://petalcrumb-cake-studio.vercel.app";
const DESCRIPTION =
  "Bespoke celebration cakes, hand-finished in London. Pressed-flower wedding tiers, sculpted birthday designs, and allergen-aware bakes for the moments that matter.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Petalcrumb Cake Studio",
    template: "%s · Petalcrumb Cake Studio",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Petalcrumb Cake Studio",
    title: "Petalcrumb Cake Studio",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Petalcrumb Cake Studio",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
