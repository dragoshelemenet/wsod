import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function GraficaPage() {
  const items = await getPublishedMediaByCategory("grafica");

  return (
    <PublicShell title="Grafica" description="Portofoliu public pentru proiecte grafice.">
      <CategoryHero
        title="Grafica"
        description="Grafica afisata ca fisiere vizuale curate, fara texte multe sub fiecare item."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Grafica"
            href={`/grafica/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
