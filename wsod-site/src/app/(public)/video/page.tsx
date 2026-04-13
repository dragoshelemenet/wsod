import { getPublishedBrands, getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function VideoPage() {
  const [items, brands] = await Promise.all([
    getPublishedMediaByCategory("video"),
    getPublishedBrands(),
  ]);

  return (
    <PublicShell title="Video" description="Portofoliu video public, rapid si curat.">
      <CategoryHero
        title="Video"
        description="Aici apar proiectele video publicate, afisate compact, fara descrieri inutile."
      />

      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Video"
            href={`/video/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
          />
        ))}
      </PublicGrid>

      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Branduri</h2>
        </div>

        <FileGrid dense>
          {brands.map((item) => (
            <FolderFileCard
              key={item.id}
              title={item.name}
              kind="brand"
              href={`/brand/${item.slug}`}
              imageUrl={
                item.logoUrl ||
                item.coverImageUrl ||
                item.mediaItems?.[0]?.thumbnailUrl ||
                item.mediaItems?.[0]?.previewUrl ||
                item.mediaItems?.[0]?.fileUrl ||
                null
              }
              imageOnly
            />
          ))}
        </FileGrid>
      </section>
    </PublicShell>
  );
}
