import Link from "next/link";
import { getSiteSettings, instagramHandle } from "@/lib/settings";

export const metadata = {
  title: "Contact",
  description: "Reach the Petalcrumb studio — email, phone, and studio address.",
};

export default async function ContactPage() {
  const s = await getSiteSettings();
  const handle = instagramHandle(s.instagramUrl);
  const addressLines = s.address.split(",").map((x) => x.trim());

  const items: { label: string; value: React.ReactNode }[] = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${s.email}`} className="text-rose-deep hover:underline underline-offset-4">
          {s.email}
        </a>
      ),
    },
    { label: "Phone", value: s.phone },
    {
      label: "Studio",
      value: (
        <span className="not-italic">
          {addressLines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </span>
      ),
    },
    { label: "Hours", value: s.openingHours },
    ...(handle
      ? [
          {
            label: "Instagram",
            value: (
              <a
                href={s.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-deep hover:underline underline-offset-4"
              >
                {handle}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-rose mb-6">Get in touch</p>
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] mb-6">
        Contact
      </h1>
      <p className="font-display text-xl md:text-2xl text-ink-soft leading-snug mb-14 max-w-2xl">
        For cake orders, the{" "}
        <Link href="/request-a-cake" className="text-rose-deep underline underline-offset-4">
          request form
        </Link>{" "}
        is the fastest route. For anything else, here&apos;s where to find us.
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 border-t border-line pt-10">
        {items.map((it) => (
          <div key={it.label}>
            <dt className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
              {it.label}
            </dt>
            <dd className="text-lg text-ink leading-relaxed">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
