import Link from "next/link";
import { CakeCard } from "@/components/CakeCard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Gallery",
};

type SearchParams = Promise<{ category?: string }>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  // Load categories (for the filter row)
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Load cakes (filtered if category param present)
  const cakes = await prisma.cake.findMany({
    where: {
      status: "PUBLISHED",
      ...(category && { category: { slug: category } }),
    },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
      {/* Header */}
      <div className="max-w-3xl mb-12 md:mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">
          Browse
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] mb-6">
          Gallery
        </h1>
        <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug">
          {cakes.length} {cakes.length === 1 ? "design" : "designs"}
          {activeCategory ? ` in ${activeCategory.name}` : " in the studio"} —
          each one made one at a time.
        </p>
      </div>

      {/* Category filter row */}
      <div className="flex flex-wrap gap-2 mb-12 md:mb-16">
        <Link
          href="/gallery"
          className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-colors ${
            !category
              ? "bg-ink text-cream"
              : "border border-line text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/gallery?category=${c.slug}`}
            className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-colors ${
              category === c.slug
                ? "bg-ink text-cream"
                : "border border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Cake grid */}
      {cakes.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-ink-soft mb-3">
            No designs in this category yet.
          </p>
          <Link
            href="/gallery"
            className="text-sm uppercase tracking-[0.2em] text-rose hover:text-rose-deep transition-colors"
          >
            View all designs →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {cakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}
    </section>
  );
}
