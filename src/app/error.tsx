"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-6 md:px-12 py-24 md:py-32 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">
        Something went wrong
      </p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-[-0.02em] mb-6">
        A little kitchen mishap.
      </h1>
      <p className="text-ink-soft text-lg mb-10">
        Something didn&apos;t load as it should. Please try again — if it keeps
        happening, do let us know.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-full text-sm tracking-wide hover:bg-rose-deep transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
        >
          Back home →
        </Link>
      </div>
    </section>
  );
}
