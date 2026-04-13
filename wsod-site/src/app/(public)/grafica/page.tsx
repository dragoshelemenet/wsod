import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function GraficaPage() {
  return (
    <PublicShell title="Grafica" description="Portofoliu public pentru proiecte grafice.">
      <CategoryHero
        title="Grafica"
        description="Grafica afisata ca fisiere vizuale curate, fara texte multe sub fiecare item."
      />
      <PublicGrid>
        <MediaFileCard title="Graphic Project 01" category="Grafica" />
        <MediaFileCard title="Graphic Project 02" category="Grafica" />
        <MediaFileCard title="Graphic Project 03" category="Grafica" />
        <MediaFileCard title="Graphic Project 04" category="Grafica" />
        <MediaFileCard title="Graphic Project 05" category="Grafica" />
        <MediaFileCard title="Graphic Project 06" category="Grafica" />
      </PublicGrid>
    </PublicShell>
  );
}
