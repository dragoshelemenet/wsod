import { getPublishedBrands } from "@/lib/dashboard/queries";
import { BrandFolderCard } from "@/components/public/brand-folder-card";
import { PublicShell } from "@/components/public/public-shell";

export default async function BrandIndexPage() {
  const items = await getPublishedBrands();

  return (
    <PublicShell title="Branduri" description="Lista publica de branduri.">
      <div className="folder-grid">
        {items.map((item) => (
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
    </PublicShell>
  );
}
