import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getMediaItemBySlugFromDb,
  getMediaByModelSlugFromDb,
  getMediaByBrandSlugFromDb,
  getMediaByAudioProfileSlugFromDb,
  getRandomMediaByCategoryFromDb,
} from "@/lib/data/db-queries";
import { buildMediaJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";
const BASE_URL = "https://wsod.cloud";

interface VideoDetailPageProps {
  params: Promise<{ slug: string }>;
}

function isImageUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].some((ext) =>
    clean.endsWith(ext)
  );
}

export async function generateMetadata({
  params,
}: VideoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "video") {
    return { title: "Video | WSOD.PROD" };
  }

  const title = item.seoTitle || `${item.title} | Video | WSOD.PROD`;
  const description =
    item.metaDescription ||
    item.description ||
    `Lucrare video din portofoliul WSOD.PROD: ${item.title}.`;
  const url = `${BASE_URL}/video/${item.slug}`;
  const image = isImageUrl(item.thumbnailUrl)
    ? item.thumbnailUrl
    : isImageUrl(item.previewUrl)
      ? item.previewUrl
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/video/${item.slug}` },
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

async function getSameOwnerItems(
  item: Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>
) {
  if (!item) return [];

  if (item.owner.type === "brand" && item.owner.slug) {
    return (await getMediaByBrandSlugFromDb(item.owner.slug, { limit: 48 }))
      .filter((x) => x.category === item.category)
      .slice(0, 6);
  }

  if (item.owner.type === "model" && item.owner.slug) {
    return (await getMediaByModelSlugFromDb(item.owner.slug, { limit: 48 }))
      .filter((x) => x.category === item.category)
      .slice(0, 6);
  }

  if (item.owner.type === "audioProfile" && item.owner.slug) {
    return (await getMediaByAudioProfileSlugFromDb(item.owner.slug, { limit: 48 }))
      .filter((x) => x.category === item.category)
      .slice(0, 6);
  }

  return [];
}

function getOwnerHref(
  item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>
) {
  if (item.owner.type === "brand" && item.owner.slug) {
    return `/brand/${item.owner.slug}`;
  }
  if (item.owner.type === "model" && item.owner.slug) {
    return `/model/${item.owner.slug}`;
  }
  if (item.owner.type === "audioProfile" && item.owner.slug) {
    return `/audio-profile/${item.owner.slug}`;
  }
  return null;
}

function getOwnerAllLabel(
  item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>
) {
  if (item.owner.type === "model") {
    return `Vezi toate clipurile cu ${item.owner.name}`;
  }
  if (item.owner.type === "brand") {
    return `Vezi toate clipurile pentru ${item.owner.name}`;
  }
  if (item.owner.type === "audioProfile") {
    return `Vezi toate clipurile pentru ${item.owner.name}`;
  }
  return "Vezi toate clipurile";
}

export default async function VideoDetailPage({
  params,
}: VideoDetailPageProps) {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "video") notFound();

  const [sameOwnerItems, randomItems] = await Promise.all([
    getSameOwnerItems(item),
    getRandomMediaByCategoryFromDb(
      "video",
      6,
      item.owner.type !== "unknown"
        ? { type: item.owner.type, slug: item.owner.slug }
        : undefined
    ),
  ]);

  const jsonLd = buildMediaJsonLd(item);
  const ownerHref = getOwnerHref(item);
  const posterImage = isImageUrl(item.thumbnailUrl)
    ? item.thumbnailUrl
    : isImageUrl(item.previewUrl)
      ? item.previewUrl
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

        {item.fileUrl ? (
          <div className="media-detail-hero">
            <video
              className="media-detail-image"
              controls
              playsInline
              preload="metadata"
              poster={posterImage || undefined}
              src={item.fileUrl}
            />
          </div>
        ) : posterImage ? (
          <div className="media-detail-hero">
            <img
              src={posterImage}
              alt={item.title}
              className="media-detail-image"
            />
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
              Vezi pagina ownerului
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
            <h2>{`Mai multe video pentru ${item.owner.name}`}</h2>
          </div>

          <MediaGrid
            items={sameOwnerItems}
            emptyText="Nu există alte video similare momentan."
          />

          <div className="model-page-actions">
            {ownerHref ? (
              <Link href={ownerHref} className="media-open-button">
                {getOwnerAllLabel(item)}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte video</h2>
          </div>

          <MediaGrid
            items={randomItems}
            emptyText="Nu există alte video momentan."
          />

          <div className="model-page-actions">
            <Link href="/video" className="media-link">
              Vezi toate video
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
