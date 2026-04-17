import Link from "next/link";
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

function hasAiBadge(item: any) {
  return Boolean(item.aiMode || item.aiEdited);
}

function getAiMode(item: any) {
  if (item.aiMode === "ai" || item.aiMode === "ai-edit") return item.aiMode;
  return item.aiEdited ? "ai-edit" : undefined;
}

function AiBadge({ mode }: { mode?: string }) {
  const isFullAi = mode === "ai";
  const title = isFullAi
    ? "Grafică creată cu AI."
    : "Unele elemente au fost schimbate cu AI.";
  const label = isFullAi ? "AI" : "AI EDIT";

  return (
    <span className="ai-photo-badge public-card-ai-badge" data-ai-tooltip={title}>
      <span className="ai-photo-badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="ai-photo-badge-icon-svg">
          <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3z" fill="currentColor" />
        </svg>
      </span>
      <span className="ai-photo-badge-text">{label}</span>
    </span>
  );
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
      ? sameBrandGraphics
          .map((graphic) => ({
            id: graphic.id,
            title: graphic.title,
            displayTitle: looksAutoTitle(graphic.title)
              ? item.brand?.name || item.graphicKind || "Grafica"
              : graphic.title,
            slug: graphic.slug,
            src: graphic.fileUrl || graphic.previewUrl || graphic.thumbnailUrl || "",
            thumb: graphic.thumbnailUrl || graphic.previewUrl || graphic.fileUrl || "",
            rotation: (graphic as any).rotation ?? 0,
            aiMode: getAiMode(graphic),
          }))
          .filter((entry) => entry.src)
      : item.personModelId
      ? sameModelGraphics
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
            aiMode: getAiMode(graphic),
          }))
          .filter((entry) => entry.src)
      : [
          {
            id: item.id,
            title: item.title,
            displayTitle: getDisplayTitle(item),
            slug: item.slug,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
            aiMode: getAiMode(item),
          },
        ].filter((entry) => entry.src);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div className="detail-top-row">
          <Link href="/grafica" className="detail-back-button">Înapoi</Link>
          <h1 id="detail-dynamic-title">{displayTitle}</h1>
        </div>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect grafic."}
        </p>

        <FotoDetailGalleryClient items={mainGalleryItems} titleTargetId="detail-dynamic-title" />
      </section>

      {item.personModelId && sameModelGraphics.length > 1 ? (
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

      
    </main>
  );
}
