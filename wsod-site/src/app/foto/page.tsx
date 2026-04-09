import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import {
  getBrandsFromDb,
  getModelsFromDb,
  getMediaByCategoryFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Foto | WSOD.PROD",
  description:
    "Portofoliu foto WSOD.PROD organizat pe branduri și modele, cu lucrări foto prezentate clar și rapid.",
  alternates: {
    canonical: "/foto",
  },
};

export default async function FotoPage() {
  const [brands, models, items] = await Promise.all([
    getBrandsFromDb(),
    getModelsFromDb(),
    getMediaByCategoryFromDb("foto", { limit: 24 }),
  ]);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>PHOTO</h1>
        <p className="inner-description">
          Portofoliu foto organizat pe branduri și modele, plus selecții recente din toate lucrările.
        </p>

        <OwnerFolderGrid
          title="Branduri"
          items={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            imageUrl: brand.logoUrl ?? brand.coverImageUrl ?? null,
            href: `/brand/${brand.slug}`,
            subtitle: "Vezi toate materialele brandului",
          }))}
          emptyText="Nu există branduri momentan."
        />

        <OwnerFolderGrid
          title="Modele"
          items={models.map((model) => ({
            id: model.id,
            name: model.name,
            slug: model.slug,
            imageUrl: model.portraitImageUrl ?? null,
            href: `/model/${model.slug}`,
            subtitle: "Vezi toate materialele modelului",
          }))}
          emptyText="Nu există modele momentan."
        />

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Selecții foto</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există materiale foto momentan."
          />
        </div>
      </section>
    </main>
  );
}
