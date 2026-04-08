import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MediaGrid from "@/components/media/MediaGrid";
import { getBrandBySlugFromDb, getBrandsFromDb, getMediaByBrandSlugFromDb } from "@/lib/data/db-queries";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const brands = await getBrandsFromDb();

  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlugFromDb(slug);

  if (!brand) {
    return {
      title: "Brand inexistent | WSOD.PROD",
    };
  }

  return {
    title: `${brand.name} | Portofoliu brand | WSOD.PROD`,
    description: `Materiale video, foto, grafică, audio și website asociate brandului ${brand.name}.`,
    alternates: {
      canonical: `/brand/${slug}`,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlugFromDb(slug);

  if (!brand) {
    notFound();
  }

  const items = await getMediaByBrandSlugFromDb(slug);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>{brand.name}</h1>
        <p className="inner-description">
          Toate materialele asociate acestui brand, grupate într-o singură pagină.
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există materiale pentru acest brand momentan."
        />
      </section>
    </main>
  );
}