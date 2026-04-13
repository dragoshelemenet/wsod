import { getPublishedBrands } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicShell } from "@/components/public/public-shell";
import { Pagination } from "@/components/shared/pagination";

export default async function BrandIndexPage() {
  const items = await getPublishedBrands();

  return (
    <PublicShell title="Branduri" description="Lista publica de branduri, compacta si rapida.">
      <CategoryHero
        title="Branduri"
        description="Brandurile sunt afisate simplu, fara carousel, in grid rapid cu paginare clasica."
      />
      <FileGrid>
        {items.map((item) => (
          <FolderFileCard
            key={item.id}
            title={item.title}
            kind="brand"
            href={`/brand/${item.slug}`}
            imageUrl={item.logoUrl || item.coverUrl || item.mediaItems?.[0]?.coverUrl || item.mediaItems?.[0]?.fileUrl || null}
          />
        ))}
      </FileGrid>
      <Pagination />
    </PublicShell>
  );
}
