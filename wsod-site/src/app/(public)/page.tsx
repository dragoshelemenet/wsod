import Link from "next/link";

const categories = [
  { href: "/video", title: "Video" },
  { href: "/foto", title: "Foto" },
  { href: "/grafica", title: "Grafica" },
  { href: "/website", title: "Website" },
  { href: "/meta-ads", title: "Meta Ads" },
  { href: "/audio", title: "Audio" },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo">
            WSOD
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {categories.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav-link">
                {item.title}
              </Link>
            ))}
            <Link href="/servicii-preturi" className="site-nav-link">
              Servicii
            </Link>
          </nav>

          <Link href="/studio-dashboard" className="site-dashboard-link">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="page-kicker">WSOD Portfolio</p>
          <h1>Video, foto, grafica, website, meta ads si audio.</h1>
          <p className="page-description">
            Site rapid, compact, SEO-first, cu multe proiecte pe ecran si fara elemente grele inutile.
          </p>
        </div>
      </section>

      <section className="home-category-grid">
        {categories.map((item) => (
          <Link key={item.href} href={item.href} className="home-category-card">
            <div className="home-category-thumb" />
            <div className="home-category-copy">
              <h2>{item.title}</h2>
              <p>Deschide categoria</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
