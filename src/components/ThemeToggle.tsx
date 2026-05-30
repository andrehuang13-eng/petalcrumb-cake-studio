"use client";

import { useEffect, useState, useTransition } from "react";
import { setTheme } from "@/app/theme-actions";

// Light/dark toggle. Reads initial theme from <html class="dark"> (set in
// layout.tsx by SSR from cookie, or by the inline pre-paint script). Click
// flips the class instantly (optimistic) and fires a server action to persist
// the choice via cookie.
export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  // Sync once on mount with whatever the inline script decided. The
  // set-state-in-effect lint rule is intended for state derived from props;
  // here we're genuinely reading external DOM state (the html class set
  // before hydration), which is the textbook case for an effect.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    startTransition(() => {
      void setTheme(next ? "dark" : "light");
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-soft hover:text-rose-deep hover:bg-cream-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-deep/40"
    >
      {/* Render sun OR moon to avoid SSR mismatch flash. Until mounted, hide. */}
      {!mounted ? (
        <span className="block w-4 h-4" aria-hidden />
      ) : isDark ? (
        // Sun icon — shown in dark mode (click to go light)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon — shown in light mode (click to go dark)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
