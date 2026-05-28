type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  milestone?: string;
};

export function PagePlaceholder({ eyebrow, title, lede, milestone }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:px-12 md:py-32">
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">
        {eyebrow}
      </p>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] mb-8">
        {title}
      </h1>
      <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug max-w-2xl">
        {lede}
      </p>
      {milestone && (
        <p className="mt-16 text-xs tracking-[0.2em] uppercase text-ink-mute">
          ◌ {milestone}
        </p>
      )}
    </section>
  );
}
