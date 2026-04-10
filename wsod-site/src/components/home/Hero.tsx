import { getSiteContentFromDb } from "@/lib/data/site-content";

function getLines(text?: string | null) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function Hero() {
  const content = await getSiteContentFromDb();
  const serviceLines = getLines(content.servicesList);

  return (
    <section className="hero hero-dashboard-content">
      <div className="hero-main-grid">
        <div className="hero-logo-wrap">
          <div className="hero-logo">WSOD</div>
          <div className="hero-logo-sub">PROD</div>
        </div>

        <div className="hero-services-panel">
          {content.servicesEyebrow ? (
            <span className="hero-services-eyebrow">{content.servicesEyebrow}</span>
          ) : null}

          {content.servicesTitle ? (
            <h1 className="hero-services-title">{content.servicesTitle}</h1>
          ) : null}

          {serviceLines.length ? (
            <ul className="hero-services-list">
              {serviceLines.map((line) => (
                <li key={line} className="hero-services-item">
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="hero-quick-nav">
        <a
          href={content.pricingHref || "/servicii-preturi"}
          className="hero-quick-link"
          target={String(content.pricingHref || "").startsWith("http") ? "_blank" : undefined}
          rel={String(content.pricingHref || "").startsWith("http") ? "noreferrer" : undefined}
        >
          {content.pricingLabel || "Serviciile noastre"}
        </a>

        <a
          href={content.contactHref || "#contact"}
          className="hero-quick-link"
          target={String(content.contactHref || "").startsWith("http") ? "_blank" : undefined}
          rel={String(content.contactHref || "").startsWith("http") ? "noreferrer" : undefined}
        >
          {content.contactLabel || "Contact"}
        </a>

        <a
          href={content.claimHref || "#"}
          className="hero-quick-link hero-quick-link-primary"
          target={String(content.claimHref || "").startsWith("http") ? "_blank" : undefined}
          rel={String(content.claimHref || "").startsWith("http") ? "noreferrer" : undefined}
        >
          {content.claimLabel || "Claim your first video/photo for free"}
        </a>
      </div>
    </section>
  );
}
