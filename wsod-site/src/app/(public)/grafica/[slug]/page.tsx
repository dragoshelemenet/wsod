import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import {
  getPublishedMediaByCategory,
  getPublishedMediaBySlug,
} from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function looksAutoTitle(value: string) {
  const v = (value || "").trim().toLowerCase();
  if (!v) return true;
  if (v.length > 40 && /[0-9a-f]{8,}/.test(v)) return true;
  if (v.startsWith("hf") && /[0-9]/.test(v)) return true;
  return false;
}

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
            graphic.category === "grafica" &&
            graphic.brandId === item.brandId
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

  const sameModelGraphics =
    item.personModelId
      ? allGraphics.filter(
          (graphic) =>
            graphic.id !== item.id &&
            graphic.category === "grafica" &&
            graphic.personModelId === item.personModelId
        )
      : [];

  const otherModelGraphics = allGraphics
    .filter(
      (graphic) =>
        graphic.id !== item.id &&
        graphic.category === "grafica" &&
        graphic.personModelId &&
        graphic.personModelId !== item.personModelId
    )
    .slice(0, 12);

  const mainGalleryItems =
    item.brandId
      ? [
          {
            id: item.id,
            title: item.title,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
          ...sameBrandGraphics.map((graphic) => ({
            id: graphic.id,
            title: graphic.title,
            src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
            thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
            rotation: (graphic as any).rotation ?? 0,
          })),
        ].filter((entry) => entry.src)
      : item.personModelId
      ? [
          {
            id: item.id,
            title: item.title,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
          ...sameModelGraphics.map((graphic) => ({
            id: graphic.id,
            title: graphic.title,
            src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
            thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
            rotation: (graphic as any).rotation ?? 0,
          })),
        ].filter((entry) => entry.src)
      : [
          {
            id: item.id,
            title: item.title,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
        ].filter((entry) => entry.src);

  const displayTitle = looksAutoTitle(item.title)
    ? item.brand?.name || item.personModel?.name || item.graphicKind || "Grafica"
    : item.title;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{displayTitle}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect grafic."}
        </p>

        <FotoDetailGalleryClient items={mainGalleryItems} />
      </section>

      {otherBrandGraphics.length > 0 ? (
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Alte grafici din alte brand-uri</h2>
          </div>

          <PublicGrid dense>
            {otherBrandGraphics.map((graphic) => (
              <PublicCard
                key={graphic.id}
                title={graphic.title}
                href={`/grafica/${graphic.slug}`}
                imageUrl={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl}
                imageOnly
                imageFit="contain"
                mediaRatio="wide"
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}

      {item.personModelId && sameModelGraphics.length > 0 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Mai multe grafici cu același model:</h2>
          <FotoDetailGalleryClient
            items={sameModelGraphics
              .map((graphic) => ({
                id: graphic.id,
                title: graphic.title,
                src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
                thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
                rotation: (graphic as any).rotation ?? 0,
              }))
              .filter((entry) => entry.src)}
          />
        </section>
      ) : null}

      {otherModelGraphics.length > 0 ? (
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Alte grafici cu alte modele</h2>
          </div>

          <PublicGrid dense>
            {otherModelGraphics.map((graphic) => (
              <PublicCard
                key={graphic.id}
                title={graphic.title}
                href={`/grafica/${graphic.slug}`}
                imageUrl={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl}
                imageOnly
                imageFit="contain"
                mediaRatio="wide"
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}
    </main>
  );
}
