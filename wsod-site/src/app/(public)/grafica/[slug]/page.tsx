import Link from "next/link";
import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
import { BusinessCardDetailClient } from "@/components/public/business-card-detail-client";
import { GraphicFormatDetailClient } from "@/components/public/graphic-format-detail-client";
import { ExpandableDescription } from "@/components/public/ExpandableDescription";
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

function getAiMode(item: any) {
  if (item.aiMode === "ai" || item.aiMode === "ai-edit") return item.aiMode;
  return item.aiEdited ? "ai-edit" : undefined;
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

  const sameModelGraphics =
    item.personModelId
      ? allGraphics.filter(
          (graphic) =>
            graphic.category === "grafica" &&
            graphic.personModelId === item.personModelId
        )
      : [];

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
          <Link href="/grafica" className="detail-back-button" aria-label="Înapoi">←</Link>
          <h1 id="detail-dynamic-title">{displayTitle}</h1>
        </div>

        <ExpandableDescription
          className="inner-description"
          text={item.description || "Pagina individuala pentru proiect grafic."}
          collapsedLines={3}
        />

        {item.graphicKind === "carte-vizita" ? (
          <>
            <BusinessCardDetailClient
              title={displayTitle}
              previewSrc={item.fileUrl || item.previewUrl || item.thumbnailUrl || ""}
              frontSrc={(item as any).cardFrontUrl || ""}
              backSrc={(item as any).cardBackUrl || ""}
            />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">Înapoi la galerie</Link>
            </div>
          </>
        ) : item.graphicKind === "certificat" || item.graphicKind === "coperta-album" ? (
          <>
            <GraphicFormatDetailClient
              title={displayTitle}
              mainSrc={item.fileUrl || item.previewUrl || item.thumbnailUrl || ""}
              displayFormatMain={(item as any).displayFormatMain || ""}
              format16x9Url={(item as any).format16x9Url || ""}
              format9x16Url={(item as any).format9x16Url || ""}
              format1x1Url={(item as any).format1x1Url || ""}
            />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">Înapoi la galerie</Link>
            </div>
          </>
        ) : (
          <>
            <FotoDetailGalleryClient items={mainGalleryItems} titleTargetId="detail-dynamic-title" />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">Înapoi la galerie</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
