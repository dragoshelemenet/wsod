import Link from "next/link";
import WebsitePreviewZoom from "@/components/public/WebsitePreviewZoom";
import {
  getPublishedMediaByCategory,
  getPublishedMediaBySlug,
} from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const WEBSITE_ICON =
  "https://img.icons8.com/ios-filled/100/domain.png";

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Website-ul nu a fost găsit</h1>
          <p className="inner-description">Proiectul website nu a fost găsit.</p>
        </section>
      </main>
    );
  }

  const allWebsites = await getPublishedMediaByCategory("website");

  const sameBrand = allWebsites.filter(
    (website) =>
      website.id !== item.id &&
      item.brandId &&
      website.brandId === item.brandId
  );

  const otherBrands = allWebsites.filter(
    (website) =>
      website.id !== item.id &&
      (!item.brandId || website.brandId !== item.brandId)
  );

  const previewSrc =
    item.fileUrl || item.previewUrl || item.thumbnailUrl || "";

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div className="detail-top-row">
          <Link href="/website" className="detail-back-button" aria-label="Înapoi">←</Link>
          <h1>{item.title}</h1>
        </div>

        {item.description ? (
          <p className="inner-description">{item.description}</p>
        ) : null}

        {previewSrc ? (
          <>
            <WebsitePreviewZoom src={previewSrc} title={item.title} />
            <div className="detail-bottom-back">
              <Link href="/website" className="detail-bottom-back-link">Înapoi la galerie</Link>
            </div>
          </>
        ) : null}

        {sameBrand.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte website-uri ale aceluiași brand</h2>
            </div>

            <div className="website-related-grid">
              {sameBrand.map((website) => {
                const imageUrl =
                  website.thumbnailUrl ||
                  website.previewUrl ||
                  website.fileUrl ||
                  "";

                return (
                  <Link
                    key={website.id}
                    href={`/website/${website.slug}`}
                    className="website-related-link"
                  >
                    <div className="website-related-media">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={website.title}
                          className="website-related-image"
                        />
                      ) : null}

                      <div className="website-card-badge">
                        <img
                          src={WEBSITE_ICON}
                          alt="Website"
                          className="website-card-badge-icon"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {otherBrands.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte website-uri</h2>
            </div>

            <div className="website-related-grid">
              {otherBrands.map((website) => {
                const imageUrl =
                  website.thumbnailUrl ||
                  website.previewUrl ||
                  website.fileUrl ||
                  "";

                return (
                  <Link
                    key={website.id}
                    href={`/website/${website.slug}`}
                    className="website-related-link"
                  >
                    <div className="website-related-media">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={website.title}
                          className="website-related-image"
                        />
                      ) : null}

                      <div className="website-card-badge">
                        <img
                          src={WEBSITE_ICON}
                          alt="Website"
                          className="website-card-badge-icon"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
