import Link from "next/link";
import { notFound } from "next/navigation";
import MediaGrid from "@/components/media/MediaGrid";
import { featuredBrands, getBrandNameBySlug } from "@/lib/data/home-data";
import { getMediaByBrand } from "@/lib/data/media-data";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const brandExists = featuredBrands.some((brand) => brand.slug === slug);

  if (!brandExists) {
    notFound();
  }

  const items = getMediaByBrand(slug);
  const brandName = getBrandNameBySlug(slug);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>{brandName}</h1>
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