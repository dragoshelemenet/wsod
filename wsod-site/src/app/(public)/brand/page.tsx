import { CategoryHero } from "@/components/public/category-hero";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicShell } from "@/components/public/public-shell";

export default function BrandIndexPage() {
  return (
    <PublicShell
      title="Branduri"
      description="Lista publica de branduri, compacta si rapida."
    >
      <CategoryHero
        title="Branduri"
        description="Brandurile sunt afisate simplu, fara carousel, in grid rapid cu paginare clasica."
      />
      <FileGrid>
        <FolderFileCard title="Brand 01" kind="brand" />
        <FolderFileCard title="Brand 02" kind="brand" />
        <FolderFileCard title="Brand 03" kind="brand" />
        <FolderFileCard title="Brand 04" kind="brand" />
        <FolderFileCard title="Brand 05" kind="brand" />
        <FolderFileCard title="Brand 06" kind="brand" />
        <FolderFileCard title="Brand 07" kind="brand" />
        <FolderFileCard title="Brand 08" kind="brand" />
      </FileGrid>
    </PublicShell>
  );
}
