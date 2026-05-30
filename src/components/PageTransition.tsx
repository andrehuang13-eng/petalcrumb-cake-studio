"use client";

import { usePathname } from "next/navigation";

// Wraps page content. The `key` is the current pathname, so React remounts
// the inner div on every route change → the CSS animation in globals.css
// (.page-transition) re-runs. The class is gated on <html class="js"> in CSS
// so SSR + no-JS visits show content immediately, without delay.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
