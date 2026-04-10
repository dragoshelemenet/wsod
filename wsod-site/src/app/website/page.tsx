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
  title: "Website | WSOD.PROD",
  description:
    "Portofoliu website WSOD.PROD: website-uri moderne, curate și prezentări digitale pentru branduri și afaceri.",
  alternates: {
    canonical: "/website",
  },
};

export default async function WebsitePage() {
  const [brands, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("website"),
    getMediaByCategoryFromDb("website", { limit: 36 }),
  ]);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>WEBSITE</h1>
        <p className="inner-description">
          Website-uri moderne și proiecte digitale prezentate într-un format clar, rapid și ușor de explorat.
        </p>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Selecții website</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există proiecte website momentan."
          />
        </div>

        <OwnerFolderGrid
          title="Branduri"
          items={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            imageUrl:
              brand.logoUrl ??
              brand.coverImageUrl ??
              brand.previewImages?.[0] ??
              null,
            previewImages: brand.previewImages ?? [],
            href: `/brand/${brand.slug}?from=website`,
          }))}
          emptyText="Nu există branduri cu proiecte website momentan."
        />
      </section>
    </main>
  );
}
