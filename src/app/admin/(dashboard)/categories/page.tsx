import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, ButtonLink, Badge } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCategory } from "./actions";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cakes: true } } },
  });

  return (
    <div>
      <AdminHeader
        eyebrow="Catalogue"
        title="Categories"
        action={<ButtonLink href="/admin/categories/new">+ New category</ButtonLink>}
      />

      {categories.length === 0 ? (
        <p className="text-ink-mute text-sm py-12 text-center border border-dashed border-line rounded-sm">
          No categories yet.
        </p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cream-soft text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Slug</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">Cakes</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-mute font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3">{c._count.cakes}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-rose-deep transition-colors"
                      >
                        Edit
                      </Link>
                      {c._count.cakes > 0 ? (
                        <Badge tone="mute">In use</Badge>
                      ) : (
                        <DeleteButton
                          action={deleteCategory.bind(null, c.id)}
                          label="Delete"
                          confirmText={`Delete the “${c.name}” category?`}
                        />
                      )}
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
