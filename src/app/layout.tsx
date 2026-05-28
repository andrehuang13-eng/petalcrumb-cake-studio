import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Petalcrumb Cake Studio",
    template: "%s · Petalcrumb Cake Studio",
  },
  description:
    "Bespoke celebration cakes, hand-finished in London. Pressed-flower wedding tiers, sculpted birthday designs, and allergen-aware bakes for the moments that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
