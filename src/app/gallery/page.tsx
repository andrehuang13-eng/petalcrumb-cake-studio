import Link from "next/link";
import { CakeCard } from "@/components/CakeCard";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Gallery",
  description:
    "Browse Petalcrumb's bespoke cake designs — wedding tiers, birthday cakes, and allergen-aware bakes.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const cakes = await prisma.cake.findMany({
    where: {
      status: "PUBLISHED",
      ...(category && { category: { slug: category } }),
    },
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
      {/* Header */}
      <div className="max-w-3xl mb-10 md:mb-14">
        <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Browse</p>
        <h1 className="font-display tracking-[-0.02em] leading-[0.95] text-balance text-[clamp(3rem,8vw,6rem)]">
          Gallery
        </h1>
        <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug mt-6">
          {cakes.length} {cakes.length === 1 ? "design" : "designs"}
          {activeCategory ? ` in ${activeCategory.name}` : " in the studio"} —
          each one made one at a time.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12 md:mb-16">
        <FilterChip href="/gallery" label="All" active={!category} />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            href={`/gallery?category=${c.slug}`}
            label={c.name}
            active={category === c.slug}
          />
        ))}
      </div>

      {/* Grid */}
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
          {cakes.map((cake, i) => (
            <Reveal key={cake.id} delay={(i % 3) * 110}>
              <CakeCard cake={cake} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-colors ${
        active
          ? "bg-ink text-cream"
          : "border border-line text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
