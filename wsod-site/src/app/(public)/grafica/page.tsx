import { getPublishedBrands, getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { BrandFolderCard } from "@/components/public/brand-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function GraficaPage() {
  const [items, brands] = await Promise.all([
    getPublishedMediaByCategory("grafica"),
    getPublishedBrands(),
  ]);

  return (
    <PublicShell title="Grafica" description="Portofoliu public pentru proiecte grafice.">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/grafica/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
          />
        ))}
      </PublicGrid>

      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Branduri</h2>
        </div>

        <div className="folder-grid">
          {brands.map((item) => (
            <BrandFolderCard
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
