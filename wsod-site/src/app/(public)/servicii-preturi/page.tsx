import { getSiteContentRecord } from "@/lib/dashboard/queries";

function toLines(value: string | null | undefined) {
  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseServiceCard(line: string) {
  const [title = "", description = "", tags = ""] = line.split("|").map((part) => part.trim());
  return { title, description, tags };
}

function parsePackageCard(line: string) {
  const [title = "", subtitle = "", oldPrice = "", price = "", note = ""] = line
    .split("|")
    .map((part) => part.trim());

  return { title, subtitle, oldPrice, price, note };
}

export default async function ServicesPricingPage() {
  const content = await getSiteContentRecord();

  const intro = toLines(content?.servicesList);
  const serviceCards = toLines(content?.servicesCards).map(parseServiceCard);
  const packageCards = toLines(content?.packageCards).map(parsePackageCard);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <header className="services-clean-hero">
          <h1>{content?.servicesTitle || "Servicii si preturi"}</h1>
          {intro.length ? (
            <div className="services-clean-intro">
              {intro.slice(0, 2).map((item, index) => (
                <p key={`${item}-${index}`}>{item}</p>
              ))}
            </div>
          ) : null}
        </header>

        {serviceCards.length ? (
          <section className="services-clean-section">
            <div className="section-mini-head">
              <h2>Servicii</h2>
            </div>

            <div className="services-clean-grid">
              {serviceCards.map((item, index) => (
                <article key={`${item.title}-${index}`} className="services-clean-card">
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                  {item.tags ? <span>{item.tags}</span> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {packageCards.length ? (
          <section className="services-clean-section">
            <div className="section-mini-head">
              <h2>Pachete</h2>
            </div>

            <div className="services-clean-grid packages-grid">
              {packageCards.map((item, index) => (
                <article key={`${item.title}-${index}`} className="services-clean-card package-card">
                  <h3>{item.title}</h3>
                  {item.subtitle ? <p>{item.subtitle}</p> : null}

                  <div className="package-prices">
                    {item.oldPrice ? <small>{item.oldPrice}</small> : null}
                    {item.price ? <strong>{item.price}</strong> : null}
                  </div>

                  {item.note ? <span>{item.note}</span> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
