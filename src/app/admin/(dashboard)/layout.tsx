import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { logout } from "../auth-actions";

export const metadata: Metadata = {
  title: { default: "Studio admin", template: "%s · Studio admin" },
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/cakes", label: "Cakes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/account", label: "Account" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative auth gate for every dashboard route.
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="border-b border-line bg-cream-soft">
        <div className="mx-auto max-w-6xl px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-lg tracking-tight">
              Petalcrumb{" "}
              <span className="text-ink-mute text-sm font-body">· Studio</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-ink-mute">
              {admin.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 md:px-10 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
