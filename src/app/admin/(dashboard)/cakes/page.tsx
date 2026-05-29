import Link from "next/link";
import { CakeStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, ButtonLink, Badge } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCake } from "./actions";

export const metadata = { title: "Cakes" };

const STATUS_TONE: Record<CakeStatus, string> = {
  PUBLISHED: "sage",
  DRAFT: "gold",
  ARCHIVED: "mute",
};

const price = (cents: number) => `£${Math.round(cents / 100)}`;

export default async function CakesPage() {
  await requireAdmin();
  const cakes = await prisma.cake.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div>
      <AdminHeader
        eyebrow="Catalogue"
        title="Cakes"
        action={<ButtonLink href="/admin/cakes/new">+ New cake</ButtonLink>}
      />

      {cakes.length === 0 ? (
        <p className="text-ink-mute text-sm py-12 text-center border border-dashed border-line rounded-sm">
          No cakes yet. Create your first design.
        </p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cream-soft text-left">
                <th className="px-4 py-3 w-16" />
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Title</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Category</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">From</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cakes.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.images[0]?.url ?? ""}
                      alt=""
                      className="w-12 h-12 object-cover rounded-sm bg-cream-soft"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/cakes/${c.id}`} className="font-medium text-ink hover:text-rose-deep transition-colors">
                      {c.title}
                    </Link>
                    {c.featured && <span className="ml-2 text-rose" title="Featured">★</span>}
                    <div className="text-ink-mute text-xs font-mono">{c.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{c.category.name}</td>
                  <td className="px-4 py-3 tabular-nums">{price(c.basePriceCents)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[c.status]}>{c.status.toLowerCase()}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/cakes/${c.id}`} className="text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-rose-deep transition-colors">
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteCake.bind(null, c.id)}
                        label="Delete"
                        confirmText={`Delete “${c.title}” and its images? This cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
