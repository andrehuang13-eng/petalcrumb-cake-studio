import Image from "next/image";
import Link from "next/link";

type CakeCardData = {
  slug: string;
  title: string;
  basePriceCents: number;
  category: { name: string };
  images: { url: string; altText: string }[];
};

const price = (cents: number) => `£${Math.round(cents / 100)}`;

export function CakeCard({
  cake,
  priority = false,
}: {
  cake: CakeCardData;
  priority?: boolean;
}) {
  const img = cake.images[0];

  return (
    <Link href={`/cakes/${cake.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream-soft">
        {img ? (
          <Image
            src={img.url}
            alt={img.altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.2em] text-ink-mute">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute left-4 bottom-4 inline-flex items-center gap-1.5 text-cream text-xs uppercase tracking-[0.2em] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          View design <span aria-hidden>→</span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.25em] uppercase text-rose mb-1">
            {cake.category.name}
          </p>
          <h3 className="font-display text-xl leading-tight text-ink group-hover:text-rose-deep transition-colors truncate">
            {cake.title}
          </h3>
        </div>
        <p className="font-display text-lg text-ink-soft shrink-0">
          {price(cake.basePriceCents)}
        </p>
      </div>
    </Link>
  );
}
