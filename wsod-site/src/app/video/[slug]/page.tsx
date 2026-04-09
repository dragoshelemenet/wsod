import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import {
  getMediaItemBySlugFromDb,
  getRelatedMediaByCategoryFromDb,
} from "@/lib/data/db-queries";
import { buildMediaJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

interface VideoDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: VideoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "video") {
    return {
      title: "Video | WSOD.PROD",
    };
  }

  return {
    title: item.seoTitle || `${item.title} | Video | WSOD.PROD`,
    description:
      item.metaDescription ||
      item.description ||
      `Lucrare video din portofoliul WSOD.PROD: ${item.title}.`,
    alternates: {
      canonical: `/video/${item.slug}`,
    },
  };
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { slug } = await params;

  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "video") {
    notFound();
  }

  const relatedItems = await getRelatedMediaByCategoryFromDb("video", item.id, 8);
  const jsonLd = buildMediaJsonLd(item);

  const ownerHref =
    item.owner.type === "brand" && item.owner.slug
      ? `/brand/${item.owner.slug}`
      : null;

  return (
    <main className="inner-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="inner-topbar">
        <Link href="/video" className="back-link">
          ← Înapoi la video
        </Link>
      </div>

      <section className="inner-section">
        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare video din portofoliul WSOD.PROD."}
        </p>

        <div className="media-detail-meta">
          <p>
            <strong>Categorie:</strong> Video
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
              Deschide video
            </a>
          ) : null}
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte lucrări video</h2>
          </div>

          <MediaGrid
            items={relatedItems}
            emptyText="Nu există alte lucrări video momentan."
          />
        </div>
      </section>
    </main>
  );
}
