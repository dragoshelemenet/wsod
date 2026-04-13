import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
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
        <PublicCard title="Foto Project 01" subtitle="Foto" href="/foto/foto-project-01" />
        <PublicCard title="Foto Project 02" subtitle="Foto" href="/foto/foto-project-02" />
        <PublicCard title="Foto Project 03" subtitle="Foto" href="/foto/foto-project-03" />
        <PublicCard title="Foto Project 04" subtitle="Foto" href="/foto/foto-project-04" />
        <PublicCard title="Foto Project 05" subtitle="Foto" href="/foto/foto-project-05" />
        <PublicCard title="Foto Project 06" subtitle="Foto" href="/foto/foto-project-06" />
      </PublicGrid>
    </PublicShell>
  );
}
