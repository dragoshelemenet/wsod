import Link from "next/link";

const services = [
  { title: "VIDEO", href: "/video" },
  { title: "PHOTO", href: "/foto" },
  { title: "GRAPHIC", href: "/grafica" },
  { title: "WEBSITE", href: "/website" },
  { title: "META ADS", href: "/meta-ads" },
  { title: "AUDIO", href: "/audio" },
];

const brands = [
  { title: "Coca-Cola", href: "/brand/coca-cola" },
  { title: "Samsung", href: "/brand/samsung" },
  { title: "ING Bank", href: "/brand/ing-bank" },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-logo-wrap">
          <div className="hero-logo">WSOD</div>
          <div className="hero-logo-sub">PROD</div>
        </div>

        <div className="hero-copy">
          <h1>AGENȚIE MEDIA DIGITALĂ &amp; VIDEO</h1>
        </div>
      </section>

      <section className="section">
        <div className="folder-grid">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="folder-card">
              <div className="folder-top" />
              <div className="folder-body">
                <span>{service.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section brands-section">
        <h2>BRANDS WE WORKED WITH</h2>

        <div className="brand-grid">
          {brands.map((brand) => (
            <Link key={brand.title} href={brand.href} className="brand-card">
              <div className="folder-top" />
              <div className="folder-body brand-body">
                <span>{brand.title}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="dots">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <footer className="footer">
        <a href="#">INSTA</a>
        <a href="#">YOUTUBE</a>
        <a href="#">TIKTOK</a>
        <a href="tel:+40727205689">+40727205689</a>
        <a href="#contact">CONTACT</a>
      </footer>
    </main>
  );
}