import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import {
  getPublishedMediaByCategory,
  getPublishedMediaBySlug,
} from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, allGraphics] = await Promise.all([
    getPublishedMediaBySlug(slug),
    getPublishedMediaByCategory("grafica"),
  ]);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Grafica not found</h1>
          <p className="inner-description">Proiectul grafic nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const sameBrandGraphics =
    item.brandId
      ? allGraphics.filter(
          (graphic) =>
            graphic.id !== item.id &&
            graphic.brandId === item.brandId &&
            graphic.category === "grafica"
        )
      : [];

  const otherBrandGraphics = allGraphics
    .filter(
      (graphic) =>
        graphic.id !== item.id &&
        graphic.category === "grafica" &&
        graphic.brandId &&
        graphic.brandId !== item.brandId
    )
    .slice(0, 12);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Grafica", href: "/grafica" },
            { label: item.title },
          ]}
        />

        <h1>{item.title}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect grafic."}
        </p>

        <div className="media-detail-hero">
          <img
            src={item.fileUrl ?? item.previewUrl ?? item.thumbnailUrl ?? undefined}
            alt={item.title}
            className="media-detail-image"
          />
        </div>

        {sameBrandGraphics.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte grafice din același brand</h2>
            </div>

            <PublicGrid dense>
              {sameBrandGraphics.map((graphic) => (
                <PublicCard
                  key={graphic.id}
                  title={graphic.title}
                  href={`/grafica/${graphic.slug}`}
                  imageUrl={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl}
                  imageOnly
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}

        {otherBrandGraphics.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Alte grafice din alte branduri</h2>
            </div>

            <PublicGrid dense>
              {otherBrandGraphics.map((graphic) => (
                <PublicCard
                  key={graphic.id}
                  title={graphic.title}
                  href={`/grafica/${graphic.slug}`}
                  imageUrl={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl}
                  imageOnly
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}
      </section>
    </main>
  );
}
