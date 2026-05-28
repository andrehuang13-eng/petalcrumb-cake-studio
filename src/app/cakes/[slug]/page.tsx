import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cake = await prisma.cake.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!cake) return { title: "Not Found" };
  return {
    title: cake.title,
    description: cake.description.slice(0, 160),
  };
}

function formatPrice(cents: number) {
  return `£${Math.round(cents / 100)}`;
}

export default async function CakeDetailPage({ params }: Props) {
  const { slug } = await params;

  const cake = await prisma.cake.findUnique({
    where: { slug },
    include: {
      category: true,
      sizeOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!cake || cake.status === "ARCHIVED") {
    notFound();
  }

  const primaryImage = cake.images[0];

  return (
    <article className="mx-auto max-w-7xl px-6 md:px-12 py-12 md:py-20">
      {/* Back link */}
      <Link
        href="/gallery"
        className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-8"
      >
        <span className="mr-2" aria-hidden>
          ←
        </span>
        Back to gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Image */}
        <div className="md:sticky md:top-24 md:self-start">
          {primaryImage ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-soft">
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-lg bg-cream-soft flex items-center justify-center text-xs uppercase tracking-[0.2em] text-ink-mute">
              No image yet
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="md:pt-4">
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">
            {cake.category.name}
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em] mb-8">
            {cake.title}
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-12 max-w-prose">
            {cake.description}
          </p>

          {/* Quick info — From + Lead time */}
          <dl className="grid grid-cols-2 gap-y-6 gap-x-8 mb-12 pb-12 border-b border-line/50">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
                From
              </dt>
              <dd className="font-display text-3xl tracking-tight">
                {formatPrice(cake.basePriceCents)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
                Lead time
              </dt>
              <dd className="font-display text-3xl tracking-tight">
                {cake.leadTimeDays} <span className="text-base">days</span>
              </dd>
            </div>
          </dl>

          {/* Sizes */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
              Sizes
            </h3>
            <ul className="space-y-3">
              {cake.sizeOptions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-baseline justify-between border-b border-line/40 pb-3"
                >
                  <span className="text-base text-ink">{s.label}</span>
                  <span className="font-display text-xl">
                    {formatPrice(s.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flavours */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
              Flavours
            </h3>
            <div className="flex flex-wrap gap-2">
              {cake.flavors.map((f) => (
                <span
                  key={f}
                  className="text-sm px-4 py-1.5 border border-line rounded-full text-ink-soft"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {cake.allergenNotes && (
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
                Allergens
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed max-w-prose">
                {cake.allergenNotes}
              </p>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors duration-300"
          >
            Request this design
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="text-xs text-ink-mute mt-4">
            We&apos;ll reply within 24 hours with a personalised quote.
          </p>
        </div>
      </div>
    </article>
  );
}
