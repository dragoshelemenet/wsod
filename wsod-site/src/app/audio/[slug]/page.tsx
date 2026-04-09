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

interface AudioDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AudioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "audio") {
    return {
      title: "Audio | WSOD.PROD",
    };
  }

  return {
    title: item.seoTitle || `${item.title} | Audio | WSOD.PROD`,
    description:
      item.metaDescription ||
      item.description ||
      `Lucrare audio din portofoliul WSOD.PROD: ${item.title}.`,
    alternates: {
      canonical: `/audio/${item.slug}`,
    },
  };
}

export default async function AudioDetailPage({ params }: AudioDetailPageProps) {
  const { slug } = await params;

  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "audio") {
    notFound();
  }

  const relatedItems = await getRelatedMediaByCategoryFromDb("audio", item.id, 8);
  const jsonLd = buildMediaJsonLd(item);

  const ownerHref =
    item.owner.type === "audioProfile" && item.owner.slug
      ? `/audio-profile/${item.owner.slug}`
      : null;

  const previewVisual = item.thumbnailUrl || item.previewUrl || null;

  return (
    <main className="inner-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="inner-topbar">
        <Link href="/audio" className="back-link">
          ← Înapoi la audio
        </Link>
      </div>

      <section className="inner-section">
        <MediaBreadcrumbs
          categoryLabel="Audio"
          categoryHref="/audio"
          ownerName={item.owner.name}
          ownerHref={ownerHref}
          currentTitle={item.title}
        />

        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare audio din portofoliul WSOD.PROD."}
        </p>

        {previewVisual ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewVisual} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

        <div className="media-detail-meta">
          <p>
            <strong>Categorie:</strong> Audio
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
              Vezi toate fișierele profilului audio
            </Link>
          ) : null}

          {item.fileUrl ? (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="media-open-button"
            >
              Deschide audio
            </a>
          ) : null}
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte lucrări audio</h2>
          </div>

          <MediaGrid
            items={relatedItems}
            emptyText="Nu există alte lucrări audio momentan."
          />
        </div>
      </section>
    </main>
  );
}
