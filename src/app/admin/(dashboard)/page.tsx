import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [cakeCount, publishedCount, newRequests, faqCount] = await Promise.all([
    prisma.cake.count(),
    prisma.cake.count({ where: { status: "PUBLISHED" } }),
    prisma.orderRequest.count({ where: { status: "NEW" } }),
    prisma.faq.count(),
  ]);

  const stats = [
    { label: "Cakes", value: cakeCount, sub: `${publishedCount} published` },
    { label: "New requests", value: newRequests, sub: "awaiting reply" },
    { label: "FAQs", value: faqCount, sub: "published" },
  ];

  const firstName = admin.name.split(" ")[0] || "there";

  return (
    <div>
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-4">
        Dashboard
      </p>
      <h1 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-[-0.02em] mb-3">
        Welcome back, {firstName}.
      </h1>
      <p className="text-ink-soft mb-10 max-w-prose">
        Manage the catalogue, answer enquiries, and keep the studio site fresh.
        More tools arrive as the admin is built out.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-line rounded-sm bg-cream-soft px-6 py-7"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-3">
              {s.label}
            </p>
            <p className="font-display text-4xl tracking-tight">{s.value}</p>
            <p className="text-xs text-ink-mute mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
      >
        View live site →
      </Link>
    </div>
  );
}
