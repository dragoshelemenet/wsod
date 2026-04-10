import Link from "next/link";
import { Metadata } from "next";
import { getSiteContentFromDb } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicii & prețuri | WSOD.PROD",
  description:
    "Servicii video, foto, grafică, website, audio și content AI pentru branduri, artiști și afaceri. Vezi prețuri orientative și descrieri detaliate.",
  alternates: {
    canonical: "/servicii-preturi",
  },
  openGraph: {
    title: "Servicii & prețuri | WSOD.PROD",
    description:
      "Servicii video, foto, grafică, website, audio și content AI pentru branduri, artiști și afaceri.",
    url: "https://wsod.cloud/servicii-preturi",
    siteName: "WSOD.PROD",
    type: "website",
  },
};

function parseCards(text?: string | null) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, description, price] = line.split("|").map((part) => part?.trim() || "");
      return { title, description, price };
    })
    .filter((item) => item.title);
}

export default async function ServicesPricingPage() {
  const content = await getSiteContentFromDb();
  const cards = parseCards(content.servicesCards);

  return (
    <main className="inner-page services-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Înapoi acasă
        </Link>
      </div>

      <section className="inner-section services-shell">
        <div className="services-header">
          <span className="services-kicker">WSOD.PROD</span>
          <h1>Servicii & prețuri</h1>
          <p className="inner-description">
            Oferim producție video, fotografie, conținut AI hiper-realist, grafică,
            website-uri moderne și servicii audio pentru branduri, afaceri, artiști
            și proiecte care vor să arate premium online. Prețurile de mai jos sunt
            orientative și pot varia în funcție de complexitate, volum și deadline.
          </p>
        </div>

        <div className="services-pricing-grid">
          {cards.map((item) => (
            <article key={item.title} className="service-price-card">
              <div className="service-price-top">
                <h2>{item.title}</h2>
                {item.price ? <span className="service-price-badge">{item.price}</span> : null}
              </div>

              {item.description ? (
                <p className="service-price-description">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="services-cta-row">
          <a
            href={content.contactHref || "https://wa.me/40727205689"}
            className="media-open-button"
            target={String(content.contactHref || "").startsWith("http") ? "_blank" : undefined}
            rel={String(content.contactHref || "").startsWith("http") ? "noreferrer" : undefined}
          >
            {content.contactLabel || "Contact"}
          </a>

          <a
            href={
              content.claimHref ||
              "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis"
            }
            className="media-link"
            target={String(content.claimHref || "").startsWith("http") ? "_blank" : undefined}
            rel={String(content.claimHref || "").startsWith("http") ? "noreferrer" : undefined}
          >
            {content.claimLabel || "Primul video/foto gratis"}
          </a>
        </div>
      </section>
    </main>
  );
}
