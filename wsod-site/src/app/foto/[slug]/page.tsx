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

interface FotoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FotoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "foto") {
    return { title: "Foto | WSOD.PROD" };
  }

  const title = item.seoTitle || `${item.title} | Foto | WSOD.PROD`;
  const description =
    item.metaDescription ||
    item.description ||
    `Lucrare foto din portofoliul WSOD.PROD: ${item.title}.`;
  const url = `${BASE_URL}/foto/${item.slug}`;
  const image = item.previewUrl || item.thumbnailUrl || item.fileUrl || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/foto/${item.slug}` },
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

async function getSameOwnerItems(item: Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>) {
  if (!item) return [];

  if (item.owner.type === "brand" && item.owner.slug) {
    const items = await getMediaByBrandSlugFromDb(item.owner.slug, { limit: 48 });
    return items.filter((entry) => entry.category === item.category).slice(0, 6);
  }

  if (item.owner.type === "model" && item.owner.slug) {
    const items = await getMediaByModelSlugFromDb(item.owner.slug, { limit: 48 });
    return items.filter((entry) => entry.category === item.category).slice(0, 6);
  }

  if (item.owner.type === "audioProfile" && item.owner.slug) {
    const items = await getMediaByAudioProfileSlugFromDb(item.owner.slug, { limit: 48 });
    return items.filter((entry) => entry.category === item.category).slice(0, 6);
  }

  return [];
}

function getOwnerHref(item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>) {
  if (item.owner.type === "brand" && item.owner.slug) return `/brand/${item.owner.slug}`;
  if (item.owner.type === "model" && item.owner.slug) return `/model/${item.owner.slug}`;
  if (item.owner.type === "audioProfile" && item.owner.slug) return `/audio-profile/${item.owner.slug}`;
  return null;
}

function getOwnerAllLabel(item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>) {
  if (item.owner.type === "model") return `Vezi toate pozele cu ${item.owner.name}`;
  if (item.owner.type === "brand") return `Vezi toate pozele pentru ${item.owner.name}`;
  if (item.owner.type === "audioProfile") return `Vezi toate pozele pentru ${item.owner.name}`;
  return "Vezi toate pozele";
}

export default async function FotoDetailPage({ params }: FotoDetailPageProps) {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "foto") notFound();

  const [sameOwnerItems, randomItems] = await Promise.all([
    getSameOwnerItems(item),
    getRandomMediaByCategoryFromDb("foto", 6,
      item.owner.type !== "unknown" ? { type: item.owner.type, slug: item.owner.slug } : undefined),
  ]);

  const ownerHref = getOwnerHref(item);
  const imageSrc = item.fileUrl || item.previewUrl || item.thumbnailUrl || null;
  const jsonLd = buildMediaJsonLd(item);

  return (
    <main className="inner-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="inner-topbar">
        <Link href="/foto" className="back-link">← Înapoi la foto</Link>
      </div>

      <section className="inner-section">
        <MediaBreadcrumbs
          categoryLabel="Foto"
          categoryHref="/foto"
          ownerName={item.owner.name}
          ownerHref={ownerHref}
          currentTitle={item.title}
        />

        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Lucrare foto din portofoliul WSOD.PROD."}
        </p>

        {imageSrc ? (
          <div className="media-detail-hero">
            <img src={imageSrc} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

        <div className="media-detail-meta">
          <p><strong>Categorie:</strong> Foto</p>
          <p><strong>Dată:</strong> {new Date(item.date).toLocaleDateString("ro-RO")}</p>
          <p><strong>Owner:</strong> {item.owner.name}</p>
        </div>

        <div className="media-actions">
          {ownerHref ? <Link href={ownerHref} className="media-link">Vezi pagina ownerului</Link> : null}
          {item.fileUrl ? (
            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="media-open-button">
              Deschide originalul
            </a>
          ) : null}
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>{item.owner.type === "model" ? `Poze cu ${item.owner.name}` : `Poze pentru ${item.owner.name}`}</h2>
          </div>

          <MediaGrid items={sameOwnerItems} emptyText="Nu există alte poze similare momentan." />

          <div className="model-page-actions">
            {ownerHref ? <Link href={ownerHref} className="media-open-button">{getOwnerAllLabel(item)}</Link> : null}
          </div>
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte poze</h2>
          </div>

          <MediaGrid items={randomItems} emptyText="Nu există alte poze momentan." />

          <div className="model-page-actions">
            <Link href="/foto" className="media-link">Vezi toate pozele</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
