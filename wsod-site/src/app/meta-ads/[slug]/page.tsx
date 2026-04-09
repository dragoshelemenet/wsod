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

interface MetaAdsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: MetaAdsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "meta-ads") {
    return {
      title: "Meta Ads | WSOD.PROD",
    };
  }

  const title = item.seoTitle || `${item.title} | Meta Ads | WSOD.PROD`;
  const description =
    item.metaDescription ||
    item.description ||
    `Material Meta Ads din portofoliul WSOD.PROD: ${item.title}.`;
  const url = `${BASE_URL}/meta-ads/${item.slug}`;
  const image = item.previewUrl || item.thumbnailUrl || item.fileUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/meta-ads/${item.slug}`,
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

export default async function MetaAdsDetailPage({
  params,
}: MetaAdsDetailPageProps) {
  const { slug } = await params;

  const item = await getMediaItemBySlugFromDb(slug);

  if (!item || item.category !== "meta-ads") {
    notFound();
  }

  const relatedItems = await getRelatedMediaByCategoryFromDb("meta-ads", item.id, 8);
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
        <Link href="/meta-ads" className="back-link">
          ← Înapoi la meta ads
        </Link>
      </div>

      <section className="inner-section">
        <MediaBreadcrumbs
          categoryLabel="Meta Ads"
          categoryHref="/meta-ads"
          ownerName={item.owner.name}
          ownerHref={ownerHref}
          currentTitle={item.title}
        />

        <h1>{item.title}</h1>

        <p className="inner-description">
          {item.description || "Material Meta Ads din portofoliul WSOD.PROD."}
        </p>

        {previewVisual ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewVisual} alt={item.title} className="media-detail-image" />
          </div>
        ) : null}

        <div className="media-detail-meta">
          <p>
            <strong>Categorie:</strong> Meta Ads
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
            <h2>Alte materiale Meta Ads</h2>
          </div>

          <MediaGrid
            items={relatedItems}
            emptyText="Nu există alte materiale Meta Ads momentan."
          />
        </div>
      </section>
    </main>
  );
}
