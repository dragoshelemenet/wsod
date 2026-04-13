import { getBrandsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function VideoPage() {
  const [items, allBrands] = await Promise.all([
    getPublishedMediaByCategory("video"),
    getBrandsWithCategoryPreviewFromDb("video"),
  ]);

  const brands = allBrands.filter(
    (item) =>
      Array.isArray(item.previewImages) &&
      item.previewImages.length > 0
  );

  return (
    <PublicShell title="Video">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/video/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
            showPlayIcon
          />
        ))}
      </PublicGrid>

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
              imageUrl={item.previewImages?.[0] || null}
            />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
