import Link from "next/link";
import { getSiteSettings, instagramHandle } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();
  const addressLines = settings.address.split(",").map((s) => s.trim());
  const handle = instagramHandle(settings.instagramUrl);

  return (
    <footer className="mt-24 md:mt-32 border-t border-line/50 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl mb-4">Petalcrumb</p>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xs">
              Bespoke celebration cakes, hand-finished in our Hackney studio.
            </p>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
              Studio
            </h4>
            <address className="text-sm text-ink-soft leading-relaxed not-italic">
              {addressLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
              <span className="block mt-2">{settings.phone}</span>
            </address>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
              Visit
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-soft hover:text-rose-deep transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ink-mute mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-ink-soft hover:text-rose-deep transition-colors"
                >
                  {settings.email}
                </a>
              </li>
              {handle && (
                <li>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft hover:text-rose-deep transition-colors"
                  >
                    {handle}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-line/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-ink-mute">
            © 2026 Petalcrumb Cake Studio · Concept portfolio project · Not a
            real business
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-mute">
            Made with care in London
          </p>
        </div>
      </div>
    </footer>
  );
}
