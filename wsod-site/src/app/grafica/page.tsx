import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import {
  getBrandsWithCategoryPreviewFromDb,
  getMediaByCategoryFromDb,
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

export default async function GraficaPage() {
  const [brands, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("grafica"),
    getMediaByCategoryFromDb("grafica", { limit: 36 }),
  ]);

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
          Portofoliu de materiale grafice realizate pentru branduri, social media și proiecte vizuale.
        </p>

        <OwnerFolderGrid
          title="Branduri"
          items={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            imageUrl: brand.logoUrl ?? brand.coverImageUrl ?? brand.previewImages?.[0] ?? null,
            previewImages: brand.previewImages ?? [],
            href: `/brand/${brand.slug}`,
          }))}
          emptyText="Nu există branduri cu materiale grafice momentan."
        />

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Grafici din branduri diferite</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există materiale grafice momentan."
          />
        </div>
      </section>
    </main>
  );
}
