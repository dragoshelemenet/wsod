import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function GraficaPage() {
  const items = await getPublishedMediaByCategory("grafica");

  return (
    <PublicShell title="Grafica" description="Portofoliu public pentru proiecte grafice.">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/grafica/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
