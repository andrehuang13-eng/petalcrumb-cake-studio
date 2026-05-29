import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { AdminHeader } from "@/components/admin/ui";
import { CategoryForm } from "../category-form";
import { createCategory } from "../actions";

export const metadata = { title: "New category" };

export default async function NewCategoryPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/categories"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← Categories
      </Link>
      <AdminHeader eyebrow="Catalogue" title="New category" />
      <CategoryForm action={createCategory} />
    </div>
  );
}
