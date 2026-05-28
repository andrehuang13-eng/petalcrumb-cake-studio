import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40 relative z-10">
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-12 items-center">
          {/* LEFT — typographic composition */}
          <div className="md:col-span-7 lg:col-span-7">
            {/* Eyebrow */}
            <p className="text-xs tracking-[0.3em] uppercase text-rose mb-8">
              Est. 2023 · Greater London
            </p>

            {/* Brand mark */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.02em] mb-3">
              Petalcrumb
            </h1>
            <p className="font-display italic text-2xl md:text-3xl text-ink-soft mb-10">
              Cake Studio
            </p>

            {/* Hairline divider */}
            <div className="w-16 h-px bg-line mb-10" />

            {/* Tagline */}
            <p className="font-display text-xl md:text-2xl lg:text-3xl text-ink-soft leading-snug max-w-xl mb-8">
              Bespoke celebration cakes, hand-finished in London —{" "}
              <span className="italic text-ink">
                for the moments that matter
              </span>
              .
            </p>

            {/* Intro paragraph */}
            <p className="text-base text-ink-soft leading-relaxed max-w-md mb-12">
              Pressed-flower wedding tiers. Sculpted birthday designs.
              Allergen-aware bakes, made one at a time in our Hackney studio.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/gallery"
                className="group inline-flex items-center justify-center gap-2 bg-ink text-cream px-7 py-4 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors duration-300"
              >
                Browse designs
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-line text-ink px-7 py-4 rounded-full text-sm tracking-wide hover:border-ink hover:bg-cream-soft transition-all duration-300"
              >
                Request a cake
              </Link>
            </div>
          </div>

          {/* RIGHT — decorative oversized letter */}
          <div className="hidden md:block md:col-span-5 lg:col-span-5 relative">
            <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
              <p
                aria-hidden
                className="font-display italic leading-none text-rose/15 select-none"
                style={{ fontSize: "clamp(14rem, 28vw, 26rem)" }}
              >
                p
              </p>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="mt-24 md:mt-32 text-xs tracking-[0.2em] uppercase text-ink-mute">
          ◌ The rest of the studio is being built
        </p>
      </div>
    </main>
  );
}
