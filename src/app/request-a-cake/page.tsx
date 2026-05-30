import type { Metadata } from "next";
import Link from "next/link";
import { OrderRequestForm } from "./order-request-form";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Request a Cake",
  description:
    "Tell us about your celebration and we'll come back with a tailored quote within two working days.",
};

type SearchParams = Promise<{ cake?: string }>;

export default async function RequestACakePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { cake: cakeSlug } = await searchParams;

  const referenceCake = cakeSlug
    ? await prisma.cake.findFirst({
        where: { slug: cakeSlug, status: "PUBLISHED" },
        select: { id: true, title: true, slug: true },
      })
    : null;

  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      <Reveal>
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Request a cake</p>
          <h1 className="font-display tracking-[-0.02em] leading-[0.95] text-balance text-[clamp(2.75rem,7vw,5rem)] mb-6">
            Tell us about <em className="italic text-rose-deep">your celebration</em>.
          </h1>
          <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug">
            The more you share, the better we can shape a cake to match.
            We&apos;ll come back within two working days with sketches and a
            tailored quote.
          </p>
        </div>
      </Reveal>

      {referenceCake && (
        <Reveal>
          <div className="mb-10 border border-line bg-cream-soft px-6 py-5 rounded-sm flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-ink-mute mb-1">Inspired by</p>
              <p className="font-display text-xl md:text-2xl text-ink">{referenceCake.title}</p>
            </div>
            <Link
              href={`/cakes/${referenceCake.slug}`}
              className="text-xs uppercase tracking-[0.2em] text-rose hover:text-rose-deep transition-colors whitespace-nowrap"
            >
              View design →
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal delay={80}>
        <OrderRequestForm referenceCake={referenceCake} />
      </Reveal>
    </section>
  );
}
