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

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const [brand, items] = await Promise.all([
    getBrandBySlugFromDb(slug),
    getMediaByBrandSlugFromDb(slug, { limit: 48 }),
  ]);

  if (!brand) {
    notFound();
  }

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

        <MediaGrid
          items={items}
          emptyText="Nu există materiale pentru acest brand momentan."
        />
      </section>
    </main>
  );
}
