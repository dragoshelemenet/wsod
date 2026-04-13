import { CategoryHero } from "@/components/public/category-hero";
import { FileGrid } from "@/components/public/file-grid";
import { FolderFileCard } from "@/components/public/folder-file-card";
import { PublicShell } from "@/components/public/public-shell";

export default function ModelIndexPage() {
  return (
    <PublicShell
      title="Modele"
      description="Lista publica de modele, compacta si rapida."
    >
      <CategoryHero
        title="Modele"
        description="Modelele sunt afisate simplu, cu accent pe vizual si viteza."
      />
      <FileGrid>
        <FolderFileCard title="Model 01" kind="model" />
        <FolderFileCard title="Model 02" kind="model" />
        <FolderFileCard title="Model 03" kind="model" />
        <FolderFileCard title="Model 04" kind="model" />
        <FolderFileCard title="Model 05" kind="model" />
        <FolderFileCard title="Model 06" kind="model" />
        <FolderFileCard title="Model 07" kind="model" />
        <FolderFileCard title="Model 08" kind="model" />
      </FileGrid>
    </PublicShell>
  );
}
