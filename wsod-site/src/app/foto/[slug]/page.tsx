import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import {
  getMediaItemBySlugFromDb,
  getRelatedMediaByCategoryFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

interface FotoDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: FotoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "foto") {
    return {
      title: "Foto | WSOD.PROD",
    };
  }

  return {
    title: item.seoTitle || `${item.title} | Foto | WSOD.PROD`,
    description:
      item.metaDescription ||
      item.description ||
      `Lucrare foto din portofoliul WSOD.PROD: ${item.title}.`,
    alternates: {
      canonical: `/foto/${item.slug}`,
    },
  };
}

export default async function FotoDetailPage({ params }: FotoDetailPageProps) {
  const { slug } = await params;

  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "foto") {
    notFound();
  }

  const relatedItems = await getRelatedMediaByCategoryFromDb("foto", item.id, 8);

  const ownerHref =
    item.owner.type === "brand" && item.owner.slug
      ? `/brand/${item.owner.slug}`
      : item.owner.type === "model" && item.owner.slug
        ? `/model/${item.owner.slug}`
        : null;

  const imageSrc = item.fileUrl || item.previewUrl || item.thumbnailUrl || null;

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/foto" className="back-link">
          ← Înapoi la foto
        </Link>
      </div>

      <section className="inner-section">
        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare foto din portofoliul WSOD.PROD."}
        </p>

        {imageSrc ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

        <div className="media-detail-meta">
          <p>
            <strong>Categorie:</strong> Foto
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
              Vezi toate fișierele {item.owner.type === "model" ? "modelului" : "brandului"}
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
            <h2>Alte lucrări foto</h2>
          </div>

          <MediaGrid
            items={relatedItems}
            emptyText="Nu există alte lucrări foto momentan."
          />
        </div>
      </section>
    </main>
  );
}
