import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/video", label: "Video" },
  { href: "/foto", label: "Foto" },
  { href: "/grafica", label: "Grafica" },
  { href: "/website", label: "Website" },
  { href: "/meta-ads", label: "Meta Ads" },
  { href: "/audio", label: "Audio" },
  { href: "/servicii-preturi", label: "Servicii" },
];

export function PublicShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo">
            WSOD
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/studio-dashboard" className="site-dashboard-link">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">WSOD Portfolio</p>
          <h1>{title}</h1>
          {description ? <p className="page-description">{description}</p> : null}
        </div>
      </section>

      <section className="page-content">{children}</section>
    </main>
  );
}
