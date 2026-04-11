import { getSiteContentFromDb } from "@/lib/data/site-content";

export default async function Hero() {
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <section className="hero hero-home-clean">
      <div className="hero-logo-wrap hero-logo-wrap-reference">
        <div className="hero-logo">WSOD</div>
        <div className="hero-logo-sub">PROD</div>
      </div>

      <div className="hero-copy hero-copy-reference">
        <h1>
          WSOD.PROD — agenție media digitală în România pentru video, foto,
          grafică, website-uri și Meta Ads
        </h1>
      </div>

      <div className="hero-home-actions">
        <a href="/servicii-preturi" className="hero-quick-link">
          Servicii & prețuri
        </a>

        <a href={contactHref} className="hero-quick-link">
          {content.contactLabel || "Contact"}
        </a>

        <a href={claimHref} className="hero-quick-link hero-quick-link-primary">
          {content.claimLabel || "Primul video/foto gratis"}
        </a>
      </div>
    </section>
  );
}
