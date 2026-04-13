import { getPublishedModels } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicShell } from "@/components/public/public-shell";
import { Pagination } from "@/components/shared/pagination";

export default async function ModelIndexPage() {
  const items = await getPublishedModels();

  return (
    <PublicShell title="Modele" description="Lista publica de modele, compacta si rapida.">
      <CategoryHero
        title="Modele"
        description="Modelele sunt afisate simplu, cu accent pe vizual si viteza."
      />
      <FileGrid>
        {items.map((item) => (
          <FolderFileCard
            key={item.id}
            title={item.title}
            kind="model"
            href={`/model/${item.slug}`}
            imageUrl={item.coverUrl || item.mediaItems?.[0]?.coverUrl || item.mediaItems?.[0]?.fileUrl || null}
          />
        ))}
      </FileGrid>
      <Pagination />
    </PublicShell>
  );
}
