export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServicesCertificates, getSiteContentRecord } from "@/lib/dashboard/queries";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";


function cleanDisplayedPrice(value: string) {
  return String(value || "")
    .replace(/[-‐-‒–—−﹣－]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toLines(value: string | null | undefined) {
  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseServiceCard(line: string) {
  const [title = "", description = "", currentPrice = "", discount = "", oldPrice = ""] = line
    .split("|")
    .map((part) => part.trim());

  return { title, description, currentPrice, discount, oldPrice };
}

function parsePackageCard(line: string) {
  const [title = "", subtitle = "", oldPrice = "", price = "", note = ""] = line
    .split("|")
    .map((part) => part.trim());

  return { title, subtitle, oldPrice, price, note };
}

function parseServiceTableRow(line: string) {
  const [category = "", service = "", price = "", note = ""] = line
    .split("|")
    .map((part) => part.trim());

  const normalizedCategory = category.toLowerCase();

  const hrefMap: Record<string, string> = {
    foto: "/foto",
    video: "/video",
    grafica: "/grafica",
    website: "/website",
    "meta-ads": "/meta-ads",
    audio: "/audio",
  };

  return {
    category: normalizedCategory,
    categoryLabel: category || "",
    service,
    price,
    note,
    href: hrefMap[normalizedCategory] || "#",
  };
}

export default async function ServicesPricingPage() {
  const [content, certificates] = await Promise.all([
    getSiteContentRecord(),
    getServicesCertificates(),
  ]);

  const intro = toLines(content?.servicesList);
  const serviceCards = toLines(content?.servicesCards).map(parseServiceCard);
  const packageCards = toLines(content?.packageCards).map(parsePackageCard);
  const serviceTableRows = toLines(content?.servicesTableRows).map(parseServiceTableRow);

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

        {serviceTableRows.length ? (
          <section className="services-clean-section">
            <div className="section-mini-head">
              <h2>Tabel servicii</h2>
            </div>

            <div className="services-price-table-wrap">
              <table className="services-price-table">
                <thead>
                  <tr>
                    <th>Categorie</th>
                    <th>Serviciu</th>
                    <th>Pret</th>
                    <th>Detalii</th>
                    <th>Exemple</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceTableRows.map((row, index) => (
                    <tr key={`${row.category}-${row.service}-${index}`}>
                      <td>
                        {row.href !== "#" ? (
                          <Link href={row.href} className="services-price-link">
                            {row.categoryLabel || row.category}
                          </Link>
                        ) : (
                          row.categoryLabel || row.category
                        )}
                      </td>
                      <td>{row.service}</td>
                      <td>{row.price}</td>
                      <td>{row.note}</td>
                      <td>
                        {row.href !== "#" ? (
                          <Link href={row.href} className="services-examples-button">
                            Vezi exemple
                          </Link>
                        ) : (
                          <span className="services-examples-button is-disabled">
                            Fără link
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {serviceCards.length ? (
          <section className="services-clean-section">
            <div className="section-mini-head">
              <h2>Servicii</h2>
            </div>

            <div className="services-clean-grid">
              {serviceCards.map((item, index) => (
                <article key={`${item.title}-${index}`} className="services-clean-card package-card">
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}

                  {(item.oldPrice || item.currentPrice) ? (
                    <div className="package-prices">
                      {item.oldPrice ? <small>{item.oldPrice}</small> : null}
                      {item.currentPrice ? <strong>{cleanDisplayedPrice(String(item.currentPrice))}</strong> : null}
                    </div>
                  ) : null}

                  {item.discount ? <span className="service-card-note">{item.discount}</span> : null}
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
                    {item.price ? <strong>{cleanDisplayedPrice(String(item.price))}</strong> : null}
                  </div>

                  {item.note ? <span>{item.note}</span> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {certificates.length ? (
          <section className="services-clean-section">
            <div className="section-mini-head">
              <h2>{content?.servicesCertificatesTitle || "Certificate"}</h2>
            </div>

            <PublicGrid dense>
              {certificates.map((item) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/grafica/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  imageFit="contain"
                  mediaRatio="wide"
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}
      </section>
    </main>
  );
}
