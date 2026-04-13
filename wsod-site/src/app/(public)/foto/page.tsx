import { getBrandsWithCategoryPreviewFromDb, getMediaByCategoryFromDb, getModelsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import PreviewRail from "@/components/public/PreviewRail";
import { PublicShell } from "@/components/public/public-shell";

export default async function FotoPage() {
  const [items, models, brands] = await Promise.all([
    getMediaByCategoryFromDb("foto", { limit: 120 }),
    getModelsWithCategoryPreviewFromDb("foto"),
    getBrandsWithCategoryPreviewFromDb("foto"),
  ]);

  const modelPhotos = items
    .filter((item) => item.owner?.type === "model")
    .slice(0, 24)
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/foto/${item.slug}`,
      imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
      rotation: (item as any).rotation ?? 0,
      showPlayIcon: false,
    }));

  const brandPhotos = items
    .filter((item) => item.owner?.type === "brand")
    .slice(0, 24)
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/foto/${item.slug}`,
      imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
      rotation: (item as any).rotation ?? 0,
      showPlayIcon: false,
    }));

  return (
    <PublicShell title="Foto">\n      <div className="foto-index-page">
      <PreviewRail title="Poze cu modele" items={modelPhotos} />

      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Modele</h2>
        </div>

        <div className="public-owner-folder-grid">
          {models.map((item) => (
            <OwnerFolderCard
              key={item.id}
              title={item.name}
              href={`/model/${item.slug}`}
              imageUrl={
                item.portraitImageUrl ||
                item.previewImages?.[0] ||
                item.mediaItems?.[0]?.thumbnailUrl ||
                item.mediaItems?.[0]?.previewUrl ||
                item.mediaItems?.[0]?.fileUrl ||
                null
              }
            />
          ))}
        </div>
      </section>

      <PreviewRail title="Poze brand" items={brandPhotos} />

      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Branduri</h2>
        </div>

        <div className="public-owner-folder-grid">
          {brands.map((item) => (
            <OwnerFolderCard
              key={item.id}
              title={item.name}
              href={`/brand/${item.slug}`}
              imageUrl={
                item.logoUrl ||
                item.coverImageUrl ||
                item.previewImages?.[0] ||
                item.mediaItems?.[0]?.thumbnailUrl ||
                item.mediaItems?.[0]?.previewUrl ||
                item.mediaItems?.[0]?.fileUrl ||
                null
              }
            />
          ))}
        </div>
      </section>
      </div>\n    </PublicShell>
  );
}
