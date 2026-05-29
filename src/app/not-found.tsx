import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 md:px-12 py-24 md:py-32 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">404</p>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em] mb-6">
        This page has crumbled away.
      </h1>
      <p className="text-ink-soft text-lg mb-10">
        The page you were looking for isn&apos;t here. Let&apos;s get you back to
        something sweet.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
        >
          Back home
        </Link>
        <Link
          href="/gallery"
          className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
        >
          Browse the gallery →
        </Link>
      </div>
    </section>
  );
}
