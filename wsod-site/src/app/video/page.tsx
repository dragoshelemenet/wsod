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
  title: "Video | WSOD.PROD",
  description:
    "Portofoliu video WSOD.PROD organizat pe branduri, cu materiale video și selecții recente.",
  alternates: {
    canonical: "/video",
  },
};

export default async function VideoPage() {
  const [brands, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("video"),
    getMediaByCategoryFromDb("video", { limit: 24 }),
  ]);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>VIDEO</h1>
        <p className="inner-description">
          Portofoliu video organizat pe branduri, plus materiale recente din toate proiectele.
        </p>

        <OwnerFolderGrid
          title="Branduri"
          variant="compact-file"
          items={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            imageUrl: brand.logoUrl ?? brand.coverImageUrl ?? brand.previewImages?.[0] ?? null,
            previewImages: brand.previewImages ?? [],
            href: `/brand/${brand.slug}`,
          }))}
          emptyText="Nu există branduri momentan."
        />

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Selecții video</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există materiale video momentan."
          />
        </div>
      </section>
    </main>
  );
}
