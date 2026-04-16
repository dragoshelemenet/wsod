import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
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

function getDisplayTitle(item: any) {
  return looksAutoTitle(item.title)
    ? item.brand?.name || item.personModel?.name || item.graphicKind || "Grafica"
    : item.title;
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

  const displayTitle = getDisplayTitle(item);

  const mainGalleryItems =
    item.brandId
      ? [
          {
            id: item.id,
            title: item.title,
            displayTitle: getDisplayTitle(item),
            slug: item.slug,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
          ...sameBrandGraphics.map((graphic) => ({
            id: graphic.id,
            title: graphic.title,
            displayTitle: looksAutoTitle(graphic.title)
              ? item.brand?.name || item.graphicKind || "Grafica"
              : graphic.title,
            slug: graphic.slug,
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
            displayTitle: getDisplayTitle(item),
            slug: item.slug,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
          ...sameModelGraphics.map((graphic) => ({
            id: graphic.id,
            title: graphic.title,
            displayTitle: looksAutoTitle(graphic.title)
              ? item.personModel?.name || item.graphicKind || "Grafica"
              : graphic.title,
            src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
            thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
            rotation: (graphic as any).rotation ?? 0,
          })),
        ].filter((entry) => entry.src)
      : [
          {
            id: item.id,
            title: item.title,
            displayTitle: getDisplayTitle(item),
            slug: item.slug,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
        ].filter((entry) => entry.src);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1 id="detail-dynamic-title">{displayTitle}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect grafic."}
        </p>

        <FotoDetailGalleryClient items={mainGalleryItems} titleTargetId="detail-dynamic-title" />
      </section>

      {otherBrandGraphics.length > 0 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte grafici din alte brand-uri:</h2>

          <div className="detail-thumb-grid">
            {otherBrandGraphics.map((graphic) => (
              <a
                key={graphic.id}
                href={`/grafica/${graphic.slug}`}
                className="detail-thumb-link"
              >
                <img
                  src={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || undefined}
                  alt={graphic.title}
                  className="detail-thumb-image"
                />
              </a>
            ))}
          </div>
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
                displayTitle: looksAutoTitle(graphic.title)
                  ? item.personModel?.name || item.graphicKind || "Grafica"
                  : graphic.title,
                slug: graphic.slug,
                src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
                thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
                rotation: (graphic as any).rotation ?? 0,
              }))
              .filter((entry) => entry.src)}
          />
        </section>
      ) : null}

      {otherModelGraphics.length > 0 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte grafici cu alte modele:</h2>

          <div className="detail-thumb-grid">
            {otherModelGraphics.map((graphic) => (
              <a
                key={graphic.id}
                href={`/grafica/${graphic.slug}`}
                className="detail-thumb-link"
              >
                <img
                  src={graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || undefined}
                  alt={graphic.title}
                  className="detail-thumb-image"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
