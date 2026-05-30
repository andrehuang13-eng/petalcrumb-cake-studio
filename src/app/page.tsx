import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CakeCard } from "@/components/CakeCard";
import { Reveal } from "@/components/Reveal";

const price = (cents: number) => `£${Math.round(cents / 100)}`;

const marqueeWords = [
  "Pressed-flower tiers",
  "Sculpted birthdays",
  "Allergen-aware",
  "Hand-finished",
  "Made in Hackney",
  "Bespoke, always",
];

export default async function HomePage() {
  const cakes = await prisma.cake.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: 7,
  });

  const hero = cakes[0];
  const featured = cakes.slice(1, 4);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 pt-10 md:pt-16 pb-6 md:pb-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
          <div>
            <p className="rise-in text-xs tracking-[0.35em] uppercase text-rose mb-6" style={{ animationDelay: "0.05s" }}>
              Est. 2023 · Greater London
            </p>
            <h1 className="rise-in font-display font-medium tracking-[-0.02em] leading-[0.95] text-balance text-[clamp(2.75rem,7vw,5.5rem)]" style={{ animationDelay: "0.15s" }}>
              Bespoke celebration cakes,{" "}
              <em className="italic text-rose-deep">hand-finished</em> in London.
            </h1>
            <p className="rise-in mt-7 text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl" style={{ animationDelay: "0.28s" }}>
              Pressed-flower wedding tiers, sculpted birthday designs, and
              allergen-aware bakes — made one at a time in our Hackney studio.
            </p>
            <div className="rise-in mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.4s" }}>
              <Link
                href="/request-a-cake"
                className="group inline-flex items-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
              >
                Request a cake
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/gallery" className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors">
                Browse the gallery
              </Link>
            </div>
            <div className="rise-in mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-[0.18em] text-ink-mute" style={{ animationDelay: "0.5s" }}>
              <span>Reply in 2 working days</span>
              <span>London delivery</span>
              <span>No deposit to enquire</span>
            </div>
          </div>

          {hero?.images[0] && (
            <div className="rise-in relative" style={{ animationDelay: "0.2s" }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-soft shadow-[0_40px_80px_-40px_rgba(31,26,20,0.45)]">
                <Image
                  src={hero.images[0].url}
                  alt={hero.images[0].altText}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <Link
                href={`/cakes/${hero.slug}`}
                className="group absolute -bottom-5 -left-3 sm:left-6 bg-cream border border-line rounded-xl px-5 py-3 shadow-[0_20px_40px_-24px_rgba(31,26,20,0.5)] hover:border-ink transition-colors"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-ink-mute mb-0.5">
                  Featured · {hero.category.name}
                </p>
                <p className="font-display text-lg leading-none group-hover:text-rose-deep transition-colors">
                  {hero.title}{" "}
                  <span className="text-ink-mute text-sm">— from {price(hero.basePriceCents)}</span>
                </p>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Marquee ===== */}
      <div className="marquee border-y border-line/60 py-4 my-10 md:my-16">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {marqueeWords.map((w) => (
                <span key={w} className="flex items-center">
                  <span className="font-display italic text-2xl md:text-3xl text-ink-soft px-6">{w}</span>
                  <span className="text-rose">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== Featured ===== */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-12 py-10 md:py-16">
          <Reveal className="flex items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-rose mb-3">Selected work</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-[-0.01em]">Featured designs</h2>
            </div>
            <Link href="/gallery" className="hidden sm:inline-flex items-center text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors whitespace-nowrap">
              View all →
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {featured.map((cake, i) => (
              <Reveal key={cake.id} delay={i * 110}>
                <CakeCard cake={cake} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===== Studio strip ===== */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-6 md:px-12 my-10 md:my-20">
          <div className="bg-ink text-cream rounded-2xl px-8 py-14 md:px-16 md:py-20">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">How we work</p>
              <h2 className="font-display text-3xl md:text-5xl leading-tight tracking-[-0.01em] mb-6">
                Every cake starts with a conversation.
              </h2>
              <p className="text-cream/75 text-lg leading-relaxed mb-8">
                There&apos;s no checkout — and that&apos;s on purpose. Tell us
                about your occasion and we&apos;ll come back within two working
                days with sketches, flavours, and a tailored quote.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-cream hover:text-rose transition-colors">
                Our story <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== Closing CTA ===== */}
      <Reveal>
        <section className="mx-auto max-w-3xl px-6 md:px-12 text-center py-16 md:py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Let&apos;s begin</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.97] tracking-[-0.02em] text-balance mb-8">
            Have a date in mind?
          </h2>
          <Link
            href="/request-a-cake"
            className="group inline-flex items-center gap-2 bg-ink text-cream px-8 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
          >
            Request a cake
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </section>
      </Reveal>
    </>
  );
}
