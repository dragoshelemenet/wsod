import Link from "next/link";
import WebsitePreviewZoom from "@/components/public/WebsitePreviewZoom";
import {
  getPublishedMediaByCategory,
  getPublishedMediaBySlug,
} from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
        <h1>{item.title}</h1>

        {item.description ? (
          <p className="inner-description">{item.description}</p>
        ) : null}

        {previewSrc ? (
          <WebsitePreviewZoom src={previewSrc} title={item.title} />
        ) : null}

        {sameBrand.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte website-uri ale aceluiași brand</h2>
            </div>

            <div className="public-grid public-grid-dense">
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
                    className="public-card public-card-image-only"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={website.title}
                        className="public-card-image"
                      />
                    ) : null}
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

            <div className="public-grid public-grid-dense">
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
                    className="public-card public-card-image-only"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={website.title}
                        className="public-card-image"
                      />
                    ) : null}
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
