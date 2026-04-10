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
  title: "Meta Ads | WSOD.PROD",
  description:
    "Portofoliu Meta Ads WSOD.PROD: materiale pentru reclame, vizuale de campanie și conținut pentru promovare online.",
  alternates: {
    canonical: "/meta-ads",
  },
};

export default async function MetaAdsPage() {
  const [brands, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("meta-ads"),
    getMediaByCategoryFromDb("meta-ads", { limit: 36 }),
  ]);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>META ADS</h1>
        <p className="inner-description">
          Vizuale și materiale pentru campanii Meta Ads, organizate clar pentru prezentare și explorare rapidă.
        </p>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Selecții Meta Ads</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există materiale Meta Ads momentan."
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
            href: `/brand/${brand.slug}?from=meta-ads`,
          }))}
          emptyText="Nu există branduri cu materiale Meta Ads momentan."
        />
      </section>
    </main>
  );
}
