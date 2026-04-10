import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerIntroCard from "@/components/media/OwnerIntroCard";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getBrandBySlugFromDb,
  getMediaByBrandSlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

const BASE_URL = "https://wsod.cloud";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    from?: string;
  }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlugFromDb(slug);

  if (!brand) {
    return {
      title: "Brand | WSOD.PROD",
    };
  }

  const title = brand.seoTitle || `${brand.name} | WSOD.PROD`;
  const description =
    brand.metaDescription ||
    brand.description ||
    `Materiale realizate pentru ${brand.name} de WSOD.PROD.`;
  const url = `${BASE_URL}/brand/${brand.slug}`;
  const image = brand.logoUrl || brand.coverImageUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/brand/${brand.slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "WSOD.PROD",
      type: "profile",
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

function groupGraphics(items: Awaited<ReturnType<typeof getMediaByBrandSlugFromDb>>) {
  const graphics = items.filter((item) => item.category === "grafica");
  const grouped = new Map<string, typeof graphics>();

  for (const item of graphics) {
    const key = item.graphicKind?.trim() || "Grafică";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  return [...grouped.entries()]
    .map(([label, groupItems]) => ({
      label,
      items: [...groupItems].sort((a, b) => {
        const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        if (orderDiff !== 0) return orderDiff;
        return +new Date(b.date) - +new Date(a.date);
      }),
      groupOrder:
        groupItems.reduce(
          (min, item) => Math.min(min, item.groupOrder ?? 0),
          Number.POSITIVE_INFINITY
        ) || 0,
    }))
    .sort((a, b) => a.groupOrder - b.groupOrder || a.label.localeCompare(b.label));
}

function categoryTitle(category: string) {
  switch (category) {
    case "video":
      return "Video";
    case "foto":
      return "Poze";
    case "website":
      return "Website";
    case "meta-ads":
      return "Meta Ads";
    case "audio":
      return "Audio";
    default:
      return category;
  }
}

function buildOrderedCategories(from?: string) {
  if (from === "video") return ["video", "foto", "website", "meta-ads", "audio"];
  if (from === "grafica") return ["video", "foto", "website", "meta-ads", "audio"];
  if (from === "foto") return ["foto", "video", "website", "meta-ads", "audio"];
  if (from === "website") return ["website", "video", "foto", "meta-ads", "audio"];
  if (from === "meta-ads") return ["meta-ads", "video", "foto", "website", "audio"];
  if (from === "audio") return ["audio", "video", "foto", "website", "meta-ads"];

  return ["video", "foto", "website", "meta-ads", "audio"];
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const from = String(resolvedSearchParams?.from || "").trim().toLowerCase();

  const [brand, items] = await Promise.all([
    getBrandBySlugFromDb(slug),
    getMediaByBrandSlugFromDb(slug, { limit: 200 }),
  ]);

  if (!brand) {
    notFound();
  }

  const orderedCategories = buildOrderedCategories(from);
  const graphicGroups = groupGraphics(items);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <MediaBreadcrumbs
          categoryLabel="Branduri"
          categoryHref="/foto"
          currentTitle={brand.name}
        />

        <OwnerIntroCard
          title={brand.name}
          description={brand.description}
          imageUrl={brand.logoUrl || brand.coverImageUrl || null}
          metaLine="Brand page"
        />

        {orderedCategories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);
          if (!categoryItems.length) return null;

          return (
            <div key={category} className="owner-folder-section">
              <div className="owner-folder-section-head">
                <h2>{categoryTitle(category)}</h2>
              </div>

              <MediaGrid
                items={categoryItems}
                emptyText={`Nu există materiale ${categoryTitle(category).toLowerCase()} momentan.`}
              />
            </div>
          );
        })}

        {graphicGroups.map((group) => (
          <div key={group.label} className="owner-folder-section">
            <div className="owner-folder-section-head">
              <h2>{group.label}</h2>
            </div>

            <MediaGrid
              items={group.items}
              emptyText="Nu există materiale grafice în acest grup."
            />
          </div>
        ))}

        {graphicGroups.length ? (
          <div className="model-page-actions">
            <Link href={`/grafica?brand=${brand.slug}`} className="media-open-button">
              Vezi toate graficele pentru {brand.name}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
