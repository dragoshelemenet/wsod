import Link from "next/link";
import { notFound } from "next/navigation";
import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
import { BusinessCardDetailClient } from "@/components/public/business-card-detail-client";
import { GraphicFormatDetailClient } from "@/components/public/graphic-format-detail-client";
import { AlbumCoverDetailClient } from "@/components/public/album-cover-detail-client";
import { ExpandableDescription } from "@/components/public/ExpandableDescription";
import { DeliveryQualityInfo } from "@/components/public/DeliveryQualityInfo";
import {
  getPublishedMediaByCategory,
  getPublishedMediaBySlug,
} from "@/lib/dashboard/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item || item.category !== "grafica") {
    notFound();
  }

  const allGrafica = await getPublishedMediaByCategory("grafica");

  const displayTitle = item.seoTitle || item.title || "Proiect grafic";

  const mainGalleryItems = [
    {
      id: item.id,
      title: item.title || displayTitle,
      src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
      thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
      beforeAiSrc: item.beforeAiUrl || "",
    },
  ];

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div className="detail-top-row">
          <Link href="/grafica" className="detail-back-button" aria-label="Înapoi la grafica">
            ←
          </Link>
          <h1 id="detail-dynamic-title">{displayTitle}</h1>
        </div>

        <ExpandableDescription
          className="inner-description"
          text={item.description || "Pagina individuala pentru proiect grafic."}
          collapsedLines={3}
        />

        <DeliveryQualityInfo className="delivery-quality-block" />

        {item.graphicKind === "carte-vizita" ? (
          <>
            <BusinessCardDetailClient
              title={displayTitle}
              previewSrc={item.fileUrl || item.previewUrl || item.thumbnailUrl || ""}
              frontSrc={(item as any).cardFrontUrl || ""}
              backSrc={(item as any).cardBackUrl || ""}
            />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">
                Înapoi la galerie
              </Link>
            </div>
          </>
        ) : item.graphicKind === "certificat" ? (
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
              <Link href="/grafica" className="detail-bottom-back-link">
                Înapoi la galerie
              </Link>
            </div>
          </>
        ) : item.graphicKind === "coperta-album" ? (
          <>
            <AlbumCoverDetailClient
              title={displayTitle}
              frontSrc={item.fileUrl || item.previewUrl || item.thumbnailUrl || ""}
              backSrc={(item as any).albumBackUrl || ""}
            />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">
                Înapoi la galerie
              </Link>
            </div>
          </>
        ) : (
          <>
            <FotoDetailGalleryClient items={mainGalleryItems} titleTargetId="detail-dynamic-title" />
            <div className="detail-bottom-back">
              <Link href="/grafica" className="detail-bottom-back-link">
                Înapoi la galerie
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
