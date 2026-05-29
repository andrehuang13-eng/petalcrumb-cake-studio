import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { CakeForm } from "../cake-form";
import { createCake } from "../actions";

export const metadata = { title: "New cake" };

export default async function NewCakePage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Link
        href="/admin/cakes"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← Cakes
      </Link>
      <AdminHeader eyebrow="Catalogue" title="New cake" />

      {categories.length === 0 ? (
        <p className="text-ink-soft text-sm">
          Create a{" "}
          <Link href="/admin/categories/new" className="text-rose-deep underline">
            category
          </Link>{" "}
          first — every cake needs one.
        </p>
      ) : (
        <>
          <p className="text-ink-soft text-sm mb-8 max-w-prose">
            Save the basics, then add images and sizes on the next screen.
          </p>
          <CakeForm action={createCake} categories={categories} submitLabel="Create cake" />
        </>
      )}
    </div>
  );
}
