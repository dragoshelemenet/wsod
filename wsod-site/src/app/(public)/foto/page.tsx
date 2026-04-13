import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function FotoPage() {
  return (
    <PublicShell title="Foto" description="Portofoliu foto public cu afisare compacta.">
      <CategoryHero
        title="Foto"
        description="Pozele trebuie sa fie mici in listare, multe pe ecran, iar la deschidere mari si curate."
      />
      <PublicGrid>
        <MediaFileCard title="Foto Project 01" category="Foto" />
        <MediaFileCard title="Foto Project 02" category="Foto" />
        <MediaFileCard title="Foto Project 03" category="Foto" />
        <MediaFileCard title="Foto Project 04" category="Foto" />
        <MediaFileCard title="Foto Project 05" category="Foto" />
        <MediaFileCard title="Foto Project 06" category="Foto" />
      </PublicGrid>
    </PublicShell>
  );
}
