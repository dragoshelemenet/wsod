import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerIntroCard from "@/components/media/OwnerIntroCard";
import {
  getBrandBySlugFromDb,
  getMediaByBrandSlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

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

  return {
    title: brand.seoTitle || `${brand.name} | WSOD.PROD`,
    description:
      brand.metaDescription ||
      brand.description ||
      `Materiale realizate pentru ${brand.name} de WSOD.PROD.`,
    alternates: {
      canonical: `/brand/${brand.slug}`,
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
