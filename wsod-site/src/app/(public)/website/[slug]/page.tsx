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
          <h1>Website not found</h1>
          <p className="inner-description">Proiectul website nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const allWebsites = await getPublishedMediaByCategory("website");
  const sameBrand =
    item.brandId != null
      ? allWebsites.filter(
          (entry) => entry.slug !== item.slug && entry.brandId === item.brandId
        )
      : [];

  const otherBrands = allWebsites.filter(
    (entry) =>
      entry.slug !== item.slug &&
      (item.brandId == null || entry.brandId !== item.brandId)
  );

  const previewSrc = item.fileUrl || item.previewUrl || item.thumbnailUrl || "";

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{item.title}</h1>

        {item.description ? (
          <p className="inner-description">{item.description}</p>
        ) : null}

        {previewSrc ? (
          <WebsitePreviewZoom src={previewSrc} alt={item.title} />
        ) : null}

        {sameBrand.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte website-uri ale aceluiași brand</h2>
            </div>

            <div className="media-thumb-grid">
              {sameBrand.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/website/${entry.slug}`}
                  className="media-thumb-card"
                >
                  <img
                    src={entry.thumbnailUrl || entry.previewUrl || entry.fileUrl || ""}
                    alt={entry.title}
                    className="media-thumb-image"
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {otherBrands.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte website-uri</h2>
            </div>

            <div className="media-thumb-grid">
              {otherBrands.slice(0, 12).map((entry) => (
                <Link
                  key={entry.id}
                  href={`/website/${entry.slug}`}
                  className="media-thumb-card"
                >
                  <img
                    src={entry.thumbnailUrl || entry.previewUrl || entry.fileUrl || ""}
                    alt={entry.title}
                    className="media-thumb-image"
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}