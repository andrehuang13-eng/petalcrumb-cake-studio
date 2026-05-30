import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "FAQ",
  description:
    "Lead times, delivery area, the custom design process, allergens, deposits, and cancellations.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      <Reveal>
        <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Answers</p>
        <h1 className="font-display tracking-[-0.02em] leading-[0.95] text-balance text-[clamp(2.75rem,7vw,5rem)] mb-6">
          Frequently asked
        </h1>
        <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug mb-14 max-w-2xl">
          The things most people ask before they order. Anything else, just{" "}
          <Link href="/contact" className="text-rose-deep underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </Reveal>

      {faqs.length === 0 ? (
        <p className="text-ink-mute">Questions are being added — check back soon.</p>
      ) : (
        <dl className="border-t border-line">
          {faqs.map((f, i) => (
            <Reveal key={f.id} delay={(i % 4) * 80}>
              <div className="py-7 border-b border-line">
                <dt className="font-display text-xl md:text-2xl text-ink mb-3">
                  {f.question}
                </dt>
                <dd className="text-ink-soft leading-relaxed whitespace-pre-wrap">
                  {f.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      )}

      <Reveal>
        <div className="mt-16 pt-10 border-t border-line">
          <p className="font-display text-2xl text-ink mb-4">
            Ready to talk about your cake?
          </p>
          <Link
            href="/request-a-cake"
            className="group inline-flex items-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
          >
            Request a cake
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
