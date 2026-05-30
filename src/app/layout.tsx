import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { PublicChromeGate } from "@/components/PublicChromeGate";
import { getTheme } from "@/lib/theme";

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

// Pre-paint script: (1) flips on the `js` class to enable the motion layer;
// (2) when no theme cookie is set, picks the user's system preference so dark
// fans don't get a flash of light. When a cookie IS set, the server already
// applied `.dark` correctly — we just leave it.
const NO_FOUC_SCRIPT = `(function(){
  var d=document.documentElement; d.classList.add('js');
  try {
    var m=document.cookie.match(/(?:^|; )petalcrumb_theme=([^;]+)/);
    if(!m && window.matchMedia('(prefers-color-scheme: dark)').matches){
      d.classList.add('dark');
    }
  } catch(e){}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  const htmlClass =
    "h-full antialiased" + (theme === "dark" ? " dark" : "");

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <PublicChromeGate>
          <Footer />
        </PublicChromeGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
