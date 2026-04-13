import { getSiteContentRecord } from "@/lib/dashboard/queries";

function toLines(value: string | null | undefined) {
  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ServicesPricingPage() {
  const content = await getSiteContentRecord();

  const services = toLines(content?.servicesList);
  const packages = toLines(content?.packageCards);
  const cards = toLines(content?.servicesCards);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <header className="category-hero">
          <h1>{content?.servicesTitle || "Servicii si preturi"}</h1>
          <p>
            {content?.servicesEyebrow ||
              "Pagina pentru servicii, pachete si preturi, simpla, clara si rapida."}
          </p>
        </header>

        {services.length ? (
          <section className="services-stack-section">
            <div className="section-mini-head">
              <h2>Servicii</h2>
            </div>

            <div className="services-stack-grid">
              {services.map((item, index) => (
                <article key={`${item}-${index}`} className="services-stack-card">
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {cards.length ? (
          <section className="services-stack-section">
            <div className="section-mini-head">
              <h2>Categorii</h2>
            </div>

            <div className="services-stack-grid">
              {cards.map((item, index) => (
                <article key={`${item}-${index}`} className="services-stack-card">
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {packages.length ? (
          <section className="services-stack-section">
            <div className="section-mini-head">
              <h2>Pachete</h2>
            </div>

            <div className="services-stack-grid">
              {packages.map((item, index) => (
                <article key={`${item}-${index}`} className="services-stack-card">
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {content?.pricingLabel && content?.pricingHref ? (
          <div className="site-content-actions">
            <a className="admin-submit" href={content.pricingHref}>
              {content.pricingLabel}
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
