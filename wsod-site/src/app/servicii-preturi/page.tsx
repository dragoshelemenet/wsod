import Link from "next/link";
import { Metadata } from "next";
import { getSiteContentFromDb } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicii & prețuri | WSOD.PROD",
  description:
    "Servicii video, foto, grafică, website, audio și content AI pentru branduri, artiști și afaceri. Vezi pachete, prețuri și descrieri clare.",
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

function parseIntro(text?: string | null) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseServices(text?: string | null) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, description, eyebrow] = line.split("|").map((part) => part?.trim() || "");
      return { title, description, eyebrow };
    })
    .filter((item) => item.title);
}

function parsePackages(text?: string | null) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, includes, oldPrice, newPrice, badge] = line
        .split("|")
        .map((part) => part?.trim() || "");
      return { title, includes, oldPrice, newPrice, badge };
    })
    .filter((item) => item.title);
}

export default async function ServicesPricingPage() {
  const content = await getSiteContentFromDb();
  const introLines = parseIntro(content.servicesList);
  const services = parseServices(content.servicesCards);
  const packages = parsePackages(content.packageCards);

  return (
    <main className="inner-page services-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Înapoi acasă
        </Link>
      </div>

      <section className="inner-section services-shell services-shell-rich">
        <div className="services-header services-header-rich">
          <span className="services-kicker">
            {content.servicesEyebrow || "Serviciile noastre"}
          </span>

          <h1>{content.servicesTitle || "Servicii & prețuri"}</h1>

          <div className="services-intro-grid">
            {introLines.map((line, index) => (
              <p key={`${index}-${line}`} className="services-intro-card">
                {line}
              </p>
            ))}
          </div>
        </div>

        <section className="services-section-block">
          <div className="services-section-head">
            <h2>Ce oferim</h2>
          </div>

          <div className="services-rich-grid">
            {services.map((item) => (
              <article key={item.title} className="service-rich-card">
                {item.eyebrow ? (
                  <span className="service-rich-eyebrow">{item.eyebrow}</span>
                ) : null}

                <h3>{item.title}</h3>

                {item.description ? (
                  <p className="service-rich-description">{item.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="services-section-block">
          <div className="services-section-head">
            <h2>Pachete & certificate</h2>
            <p>Poți afișa pachete promo, pachete standard sau certificate cadou.</p>
          </div>

          <div className="packages-rich-grid">
            {packages.map((item) => (
              <article key={item.title} className="package-rich-card">
                <div className="package-rich-top">
                  <div>
                    <h3>{item.title}</h3>
                    {item.badge ? <span className="package-rich-badge">{item.badge}</span> : null}
                  </div>

                  <div className="package-rich-prices">
                    {item.oldPrice ? (
                      <span className="package-old-price">{item.oldPrice}</span>
                    ) : null}
                    {item.newPrice ? (
                      <span className="package-new-price">{item.newPrice}</span>
                    ) : null}
                  </div>
                </div>

                {item.includes ? (
                  <p className="package-rich-includes">{item.includes}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

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
