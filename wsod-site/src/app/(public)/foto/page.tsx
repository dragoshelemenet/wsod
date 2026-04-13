import { getPublishedBrands, getPublishedMediaByCategory, getPublishedModels } from "@/lib/dashboard/queries";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function FotoPage() {
  const [items, models, brands] = await Promise.all([
    getPublishedMediaByCategory("foto"),
    getPublishedModels(),
    getPublishedBrands(),
  ]);

  return (
    <PublicShell title="Foto" description="Portofoliu foto public cu afisare compacta.">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/foto/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
          />
        ))}
      </PublicGrid>

      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Modele</h2>
        </div>

        <FileGrid dense>
          {models.map((item) => (
            <FolderFileCard
              key={item.id}
              title={item.name}
              kind="model"
              href={`/model/${item.slug}`}
              imageUrl={
                item.portraitImageUrl ||
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
