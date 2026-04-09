import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getMediaItemBySlugFromDb,
  getRelatedMediaByCategoryFromDb,
} from "@/lib/data/db-queries";
import { buildMediaJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

interface GraficaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GraficaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "grafica") {
    return {
      title: "Grafica | WSOD.PROD",
    };
  }

  return {
    title: item.seoTitle || `${item.title} | Grafica | WSOD.PROD`,
    description:
      item.metaDescription ||
      item.description ||
      `Lucrare grafică din portofoliul WSOD.PROD: ${item.title}.`,
    alternates: {
      canonical: `/grafica/${item.slug}`,
    },
  };
}

export default async function GraficaDetailPage({
  params,
}: GraficaDetailPageProps) {
  const { slug } = await params;

  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "grafica") {
    notFound();
  }

  const relatedItems = await getRelatedMediaByCategoryFromDb("grafica", item.id, 8);
  const jsonLd = buildMediaJsonLd(item);

  const ownerHref =
    item.owner.type === "brand" && item.owner.slug
      ? `/brand/${item.owner.slug}`
      : null;

  const previewVisual = item.previewUrl || item.thumbnailUrl || item.fileUrl || null;

  return (
    <main className="inner-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="inner-topbar">
        <Link href="/grafica" className="back-link">
          ← Înapoi la graphic
        </Link>
      </div>

      <section className="inner-section">
        <MediaBreadcrumbs
          categoryLabel="Graphic"
          categoryHref="/grafica"
          ownerName={item.owner.name}
          ownerHref={ownerHref}
          currentTitle={item.title}
        />

        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare grafică din portofoliul WSOD.PROD."}
        </p>

        {previewVisual ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewVisual} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

        <div className="media-detail-meta">
          <p>
            <strong>Categorie:</strong> Graphic
          </p>
          <p>
            <strong>Dată:</strong>{" "}
            {new Date(item.date).toLocaleDateString("ro-RO")}
          </p>
          <p>
            <strong>Owner:</strong> {item.owner.name}
          </p>
        </div>

        <div className="media-actions">
          {ownerHref ? (
            <Link href={ownerHref} className="media-link">
              Vezi toate fișierele brandului
            </Link>
          ) : null}

          {item.fileUrl ? (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="media-open-button"
            >
              Deschide originalul
            </a>
          ) : null}
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte lucrări graphic</h2>
          </div>

          <MediaGrid
            items={relatedItems}
            emptyText="Nu există alte lucrări graphic momentan."
          />
        </div>
      </section>
    </main>
  );
}
