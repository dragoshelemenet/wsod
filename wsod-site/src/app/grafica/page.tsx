import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import {
  getBrandsWithCategoryPreviewFromDb,
  getMediaByCategoryFromDb,
  getMediaByBrandSlugFromDb,
  getBrandBySlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grafica | WSOD.PROD",
  description:
    "Portofoliu grafică WSOD.PROD: materiale grafice pentru branduri, social media și campanii vizuale.",
  alternates: {
    canonical: "/grafica",
  },
};

interface GraficaPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function GraficaPage({ searchParams }: GraficaPageProps) {
  const params = (await searchParams) ?? {};
  const brandSlug = getSingleParam(params.brand).trim();

  const [brands, selectedBrand, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("grafica"),
    brandSlug ? getBrandBySlugFromDb(brandSlug) : Promise.resolve(null),
    brandSlug
      ? getMediaByBrandSlugFromDb(brandSlug, { limit: 200 })
      : getMediaByCategoryFromDb("grafica", { limit: 36 }),
  ]);

  const graphicItems = items.filter((item) => item.category === "grafica");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>GRAPHIC</h1>
        <p className="inner-description">
          {selectedBrand
            ? `Toate materialele grafice pentru ${selectedBrand.name}.`
            : "Portofoliu de materiale grafice realizate pentru branduri, social media și proiecte vizuale."}
        </p>

        {!selectedBrand ? (
          <OwnerFolderGrid
            title="Branduri"
            items={brands.map((brand) => ({
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              imageUrl: brand.logoUrl ?? brand.coverImageUrl ?? brand.previewImages?.[0] ?? null,
              previewImages: brand.previewImages ?? [],
              href: `/grafica?brand=${brand.slug}`,
            }))}
            emptyText="Nu există branduri cu materiale grafice momentan."
          />
        ) : (
          <div className="owner-folder-section">
            <div className="owner-folder-section-head">
              <h2>{selectedBrand.name}</h2>
            </div>

            <div className="admin-inline-actions">
              <Link href="/grafica" className="media-link">
                Resetează filtrul
              </Link>
              <Link href={`/brand/${selectedBrand.slug}`} className="media-link">
                Vezi pagina brandului
              </Link>
            </div>
          </div>
        )}

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>
              {selectedBrand
                ? `Toate graficele pentru ${selectedBrand.name}`
                : "Grafici din branduri diferite"}
            </h2>
          </div>

          <MediaGrid
            items={graphicItems}
            emptyText="Nu există materiale grafice momentan."
          />
        </div>
      </section>
    </main>
  );
}
