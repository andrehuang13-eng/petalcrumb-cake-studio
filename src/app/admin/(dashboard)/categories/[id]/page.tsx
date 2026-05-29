import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { CategoryForm } from "../category-form";
import { updateCategory } from "../actions";

export const metadata = { title: "Edit category" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <Link
        href="/admin/categories"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← Categories
      </Link>
      <AdminHeader eyebrow="Catalogue" title={`Edit · ${category.name}`} />
      <CategoryForm
        action={updateCategory.bind(null, category.id)}
        initial={{ name: category.name, slug: category.slug }}
      />
    </div>
  );
}
