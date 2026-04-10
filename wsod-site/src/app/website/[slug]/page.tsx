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
interface DetailPageProps { params: Promise<{ slug: string }>; }

const CATEGORY = "website";
const CATEGORY_LABEL = "Website";
const BACK_HREF = "/website";
const BACK_LABEL = "← Înapoi la website";

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);
  if (!item || item.category !== CATEGORY) return { title: CATEGORY_LABEL + " | WSOD.PROD" };
  const title = item.seoTitle || `${item.title} | ${CATEGORY_LABEL} | WSOD.PROD`;
  const description = item.metaDescription || item.description || `Lucrare ${CATEGORY_LABEL.toLowerCase()} din portofoliul WSOD.PROD: ${item.title}.`;
  const url = `${BASE_URL}/${CATEGORY}/${item.slug}`;
  const image = item.previewUrl || item.thumbnailUrl || item.fileUrl || undefined;
  return {
    title, description,
    alternates: { canonical: `/${CATEGORY}/${item.slug}` },
    openGraph: { title, description, url, siteName: "WSOD.PROD", type: "article", images: image ? [{ url: image }] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] },
  };
}

async function getSameOwnerItems(item: Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>) {
  if (!item) return [];
  if (item.owner.type === "brand" && item.owner.slug) return (await getMediaByBrandSlugFromDb(item.owner.slug, { limit: 48 })).filter((x) => x.category === CATEGORY).slice(0, 6);
  if (item.owner.type === "model" && item.owner.slug) return (await getMediaByModelSlugFromDb(item.owner.slug, { limit: 48 })).filter((x) => x.category === CATEGORY).slice(0, 6);
  if (item.owner.type === "audioProfile" && item.owner.slug) return (await getMediaByAudioProfileSlugFromDb(item.owner.slug, { limit: 48 })).filter((x) => x.category === CATEGORY).slice(0, 6);
  return [];
}

function getOwnerHref(item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>) {
  if (item.owner.type === "brand" && item.owner.slug) return `/brand/${item.owner.slug}`;
  if (item.owner.type === "model" && item.owner.slug) return `/model/${item.owner.slug}`;
  if (item.owner.type === "audioProfile" && item.owner.slug) return `/audio-profile/${item.owner.slug}`;
  return null;
}

function getAllLabel(item: NonNullable<Awaited<ReturnType<typeof getMediaItemBySlugFromDb>>>) {
  return `Vezi toate pentru ${item.owner.name}`;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);
  if (!item || item.category !== CATEGORY) notFound();

  const [sameOwnerItems, randomItems] = await Promise.all([
    getSameOwnerItems(item),
    getRandomMediaByCategoryFromDb(CATEGORY, 6, item.owner.type !== "unknown" ? { type: item.owner.type, slug: item.owner.slug } : undefined),
  ]);

  const ownerHref = getOwnerHref(item);
  const imageSrc = item.fileUrl || item.previewUrl || item.thumbnailUrl || null;
  const jsonLd = buildMediaJsonLd(item);

  return (
    <main className="inner-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="inner-topbar"><Link href={BACK_HREF} className="back-link">{BACK_LABEL}</Link></div>

      <section className="inner-section">
        <MediaBreadcrumbs categoryLabel={CATEGORY_LABEL} categoryHref={BACK_HREF} ownerName={item.owner.name} ownerHref={ownerHref} currentTitle={item.title} />
        <h1>{item.title}</h1>
        <p className="inner-description">{item.description || `Lucrare ${CATEGORY_LABEL.toLowerCase()} din portofoliul WSOD.PROD.`}</p>

        {imageSrc ? <div className="media-detail-hero"><img src={imageSrc} alt={item.title} className="media-detail-image" /></div> : null}

        <div className="media-detail-meta">
          <p><strong>Categorie:</strong> {CATEGORY_LABEL}</p>
          <p><strong>Dată:</strong> {new Date(item.date).toLocaleDateString("ro-RO")}</p>
          <p><strong>Owner:</strong> {item.owner.name}</p>
        </div>

        <div className="media-actions">
          {ownerHref ? <Link href={ownerHref} className="media-link">Vezi pagina ownerului</Link> : null}
          {item.fileUrl ? <a href={item.fileUrl} target="_blank" rel="noreferrer" className="media-open-button">Deschide originalul</a> : null}
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head"><h2>{`Mai multe ${CATEGORY_LABEL.toLowerCase()} pentru ${item.owner.name}`}</h2></div>
          <MediaGrid items={sameOwnerItems} emptyText={`Nu există alte materiale ${CATEGORY_LABEL.toLowerCase()} momentan.`} />
          <div className="model-page-actions">{ownerHref ? <Link href={ownerHref} className="media-open-button">{getAllLabel(item)}</Link> : null}</div>
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head"><h2>{`Alte materiale ${CATEGORY_LABEL.toLowerCase()}`}</h2></div>
          <MediaGrid items={randomItems} emptyText={`Nu există alte materiale ${CATEGORY_LABEL.toLowerCase()} momentan.`} />
          <div className="model-page-actions"><Link href={BACK_HREF} className="media-link">{`Vezi toate ${CATEGORY_LABEL.toLowerCase()}`}</Link></div>
        </div>
      </section>
    </main>
  );
}
