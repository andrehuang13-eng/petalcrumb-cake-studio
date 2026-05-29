import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Petalcrumb is a one-person cake studio in Hackney, London — pressed-flower wedding tiers and sculpted celebration cakes, made one at a time.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Our story</p>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] mb-8">
        Made one at a time, <em className="italic text-rose-deep">on purpose</em>.
      </h1>

      <div className="space-y-6 text-lg text-ink-soft leading-relaxed max-w-2xl">
        <p>
          Petalcrumb is a small cake studio in a railway-arch kitchen in
          Hackney, East London. We make a handful of cakes each week — never
          more — so every tier is baked, filled, and finished by hand.
        </p>
        <p>
          We&apos;re known for pressed-flower wedding cakes: real edible petals
          set into soft buttercream and gentle, off-white palettes. Alongside
          those, we sculpt birthday and celebration designs that look like the
          person they&apos;re for, not like a catalogue.
        </p>

        <h2 className="font-display text-2xl md:text-3xl text-ink pt-6">
          How it works
        </h2>
        <p>
          There&apos;s no checkout here, and that&apos;s deliberate. Every cake
          is quoted individually. You send us the occasion, the date, a rough
          guest count, and any inspiration; we come back within two working days
          with sketches, flavours, and a price. Nothing is locked in until
          you&apos;re happy.
        </p>

        <h2 className="font-display text-2xl md:text-3xl text-ink pt-6">
          Allergen-aware by default
        </h2>
        <p>
          Our kitchen handles nuts, gluten, dairy, and eggs, but we plan around
          dietary needs every week — gluten-free sponges, vegan bakes, and
          nut-free builds included. Tell us early and we&apos;ll design with it
          in mind rather than as an afterthought.
        </p>
      </div>

      <div className="mt-14 pt-10 border-t border-line">
        <Link
          href="/request-a-cake"
          className="inline-flex items-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
        >
          Start a cake request <span aria-hidden>→</span>
        </Link>
      </div>

      <p className="mt-12 text-xs tracking-[0.2em] uppercase text-ink-mute">
        ◌ Petalcrumb is a fictional studio — a concept portfolio project.
      </p>
    </section>
  );
}
