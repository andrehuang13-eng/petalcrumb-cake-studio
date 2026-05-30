"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Conditionally renders children based on whether we're on an admin route.
 * Used to hide the public-site Footer (server component, async) from /admin
 * pages without having to convert Footer to a client component or duplicate
 * routes into a "(public)" group.
 *
 * The wrapped Footer still renders server-side (and still fetches site
 * settings) on admin pages — only the *visible* output is suppressed. That
 *'s a tiny overhead in exchange for keeping the layout structure simple.
 */
export function PublicChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
