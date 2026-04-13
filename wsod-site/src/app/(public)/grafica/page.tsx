import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
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
        <PublicCard title="Graphic Project 01" subtitle="Grafica" href="/grafica/graphic-project-01" />
        <PublicCard title="Graphic Project 02" subtitle="Grafica" href="/grafica/graphic-project-02" />
        <PublicCard title="Graphic Project 03" subtitle="Grafica" href="/grafica/graphic-project-03" />
        <PublicCard title="Graphic Project 04" subtitle="Grafica" href="/grafica/graphic-project-04" />
        <PublicCard title="Graphic Project 05" subtitle="Grafica" href="/grafica/graphic-project-05" />
        <PublicCard title="Graphic Project 06" subtitle="Grafica" href="/grafica/graphic-project-06" />
      </PublicGrid>
    </PublicShell>
  );
}
