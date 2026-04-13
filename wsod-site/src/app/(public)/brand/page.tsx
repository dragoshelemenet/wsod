import { getPublishedBrands } from "@/lib/dashboard/queries";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicShell } from "@/components/public/public-shell";

export default async function BrandIndexPage() {
  const items = await getPublishedBrands();

  return (
    <PublicShell title="Branduri" description="Lista publica de branduri.">
      <FileGrid dense>
        {items.map((item) => (
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
    </PublicShell>
  );
}
