import { getSiteContentFromDb } from "@/lib/data/site-content";

export default async function Hero() {
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <section className="hero hero-home-clean">
      <div className="hero-logo-wrap">
        <div className="hero-logo">WSOD</div>
        <div className="hero-logo-sub">PROD</div>
      </div>

      <nav className="hero-home-actions" aria-label="Navigație homepage">
        <a href="/servicii-preturi" className="hero-quick-link">
          Servicii & prețuri
        </a>

        <a
          href={contactHref}
          className="hero-quick-link"
          target={String(contactHref).startsWith("http") ? "_blank" : undefined}
          rel={String(contactHref).startsWith("http") ? "noreferrer" : undefined}
        >
          Contact
        </a>

        <a
          href={claimHref}
          className="hero-quick-link hero-quick-link-primary"
          target={String(claimHref).startsWith("http") ? "_blank" : undefined}
          rel={String(claimHref).startsWith("http") ? "noreferrer" : undefined}
        >
          Primul video/foto gratis
        </a>
      </nav>
    </section>
  );
}
