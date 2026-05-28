import Image from "next/image";
import Link from "next/link";

type Props = {
  cake: {
    slug: string;
    title: string;
    basePriceCents: number;
    leadTimeDays: number;
    category: { name: string };
    images: { url: string; altText: string }[];
  };
};

export function CakeCard({ cake }: Props) {
  const image = cake.images[0];
  const price = `£${Math.round(cake.basePriceCents / 100)}`;

  return (
    <Link href={`/cakes/${cake.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-soft mb-5">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-ink-mute">
            No image
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-rose mb-2">
        {cake.category.name}
      </p>
      <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-2 group-hover:text-rose-deep transition-colors">
        {cake.title}
      </h3>
      <p className="text-sm text-ink-soft">
        From {price}{" "}
        <span className="text-ink-mute">· {cake.leadTimeDays} days lead</span>
      </p>
    </Link>
  );
}
