import { getPublishedBrands, getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function WebsitePage() {
  const [items, brands] = await Promise.all([
    getPublishedMediaByCategory("website"),
    getPublishedBrands(),
  ]);

  return (
    <PublicShell title="Website" description="Website-uri create de WSOD.PROD">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/website/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
           
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
              imageUrl={
                item.logoUrl ||
                item.coverImageUrl ||
                item.mediaItems?.[0]?.thumbnailUrl ||
                item.mediaItems?.[0]?.previewUrl ||
                item.mediaItems?.[0]?.fileUrl ||
                null
              }
            />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
