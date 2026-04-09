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

const BASE_URL = "https://wsod.cloud";

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

  const title = item.seoTitle || `${item.title} | Video | WSOD.PROD`;
  const description =
    item.metaDescription ||
    item.description ||
    `Lucrare video din portofoliul WSOD.PROD: ${item.title}.`;
  const url = `${BASE_URL}/video/${item.slug}`;
  const image = item.previewUrl || item.thumbnailUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/video/${item.slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "WSOD.PROD",
      type: "article",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
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

  const previewVisual = item.previewUrl || item.thumbnailUrl || null;

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
        <MediaBreadcrumbs
          categoryLabel="Video"
          categoryHref="/video"
          ownerName={item.owner.name}
          ownerHref={ownerHref}
          currentTitle={item.title}
        />

        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare video din portofoliul WSOD.PROD."}
        </p>

        {previewVisual ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewVisual} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

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
