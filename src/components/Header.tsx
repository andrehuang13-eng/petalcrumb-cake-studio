"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Condense the header once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-cream/90 border-b border-line shadow-[0_1px_20px_-12px_rgba(31,26,20,0.4)]"
            : "bg-cream/70 border-b border-line/30"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
          }`}
        >
          {/* Brand wordmark */}
          <Link
            href="/"
            className="font-display text-xl md:text-2xl tracking-tight hover:text-rose-deep transition-colors"
          >
            Petalcrumb
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive(item.href)
                    ? "text-ink"
                    : "text-ink-soft hover:text-rose-deep"
                }`}
              >
                {item.label}
                {/* animated underline */}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-rose-deep transition-all duration-300 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
            <Link
              href="/request-a-cake"
              className="ml-2 inline-flex items-center bg-ink text-cream px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] hover:bg-rose-deep transition-colors"
            >
              Request a cake
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 text-ink"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
              <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-cream md:hidden flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-line/50">
            <Link
              href="/"
              className="font-display text-xl tracking-tight"
              onClick={() => setMenuOpen(false)}
            >
              Petalcrumb
            </Link>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 -mr-2 text-ink"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="18" x2="18" y2="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center items-start px-8 gap-1 pb-20">
            {navItems.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group block py-3 hover:text-rose-deep transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-ink-mute font-body">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-5xl">{item.label}</span>
                </div>
              </Link>
            ))}
            <Link
              href="/request-a-cake"
              onClick={() => setMenuOpen(false)}
              className="mt-12 inline-flex items-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide"
            >
              Request a cake
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
