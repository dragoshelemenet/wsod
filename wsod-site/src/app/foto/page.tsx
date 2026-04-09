import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import {
  getBrandsWithCategoryPreviewFromDb,
  getModelsWithCategoryPreviewFromDb,
  getMediaByCategoryFromDb,
  getMediaByModelSlugFromDb,
  getModelBySlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Foto | WSOD.PROD",
  description:
    "Portofoliu foto WSOD.PROD organizat pe modele și branduri, cu lucrări foto prezentate clar și rapid.",
  alternates: {
    canonical: "/foto",
  },
};

interface FotoPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function FotoPage({ searchParams }: FotoPageProps) {
  const params = (await searchParams) ?? {};
  const modelSlug = getSingleParam(params.model).trim();

  const [brands, models, selectedModel, items] = await Promise.all([
    getBrandsWithCategoryPreviewFromDb("foto"),
    getModelsWithCategoryPreviewFromDb("foto"),
    modelSlug ? getModelBySlugFromDb(modelSlug) : Promise.resolve(null),
    modelSlug
      ? getMediaByModelSlugFromDb(modelSlug, { limit: 120 })
      : getMediaByCategoryFromDb("foto", { limit: 24 }),
  ]);

  const photoItems = items.filter((item) => item.category === "foto");

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
          {selectedModel
            ? `Toate pozele cu ${selectedModel.name}.`
            : "Portofoliu foto organizat pe modele și branduri, plus selecții recente din toate lucrările."}
        </p>

        {!selectedModel ? (
          <>
            <OwnerFolderGrid
              title="Modele"
              items={models.map((model) => ({
                id: model.id,
                name: model.name,
                slug: model.slug,
                imageUrl: model.portraitImageUrl ?? model.previewImages?.[0] ?? null,
                previewImages: model.previewImages ?? [],
                href: `/model/${model.slug}`,
              }))}
              emptyText="Nu există modele momentan."
            />

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
              emptyText="Nu există branduri momentan."
            />
          </>
        ) : (
          <div className="owner-folder-section">
            <div className="owner-folder-section-head">
              <h2>{selectedModel.name}</h2>
            </div>

            <div className="admin-inline-actions">
              <Link href="/foto" className="media-link">
                Resetează filtrul
              </Link>
            </div>
          </div>
        )}

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>{selectedModel ? `Toate pozele cu ${selectedModel.name}` : "Selecții foto"}</h2>
          </div>

          <MediaGrid
            items={photoItems}
            emptyText="Nu există materiale foto momentan."
          />
        </div>
      </section>
    </main>
  );
}
