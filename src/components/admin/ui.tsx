import Link from "next/link";

// Shared admin form/table styling. Boxed inputs read better for dense CRUD
// forms than the site's bottom-border style, while keeping the brand palette.
export const inputCx =
  "w-full rounded-sm border border-line bg-cream px-3 py-2 text-ink text-sm " +
  "focus:border-ink focus:outline-none transition-colors placeholder:text-ink-mute/60";

export const labelCx =
  "block text-xs uppercase tracking-[0.15em] text-ink-mute mb-1.5";

export function AdminHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 pb-5 border-b border-line">
      <div>
        {eyebrow && (
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-4xl leading-tight tracking-[-0.01em]">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCx}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-ink-mute text-xs mt-1.5">{hint}</p>
      )}
      {error && (
        <p className="text-rose-deep text-xs mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  rose: "bg-rose/10 text-rose-deep border-rose/30",
  sage: "bg-sage/15 text-sage border-sage/40",
  gold: "bg-gold/15 text-[#8a6a3a] border-gold/40",
  ink: "bg-ink/5 text-ink-soft border-line",
  mute: "bg-ink/5 text-ink-mute border-line",
};

export function Badge({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones | string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ${
        badgeTones[tone] ?? badgeTones.ink
      }`}
    >
      {children}
    </span>
  );
}

// Primary call-to-action link (e.g. "New cake").
export function ButtonLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-ink text-cream px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-rose-deep transition-colors rounded-sm whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
