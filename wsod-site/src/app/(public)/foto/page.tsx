import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function FotoPage() {
  const items = await getPublishedMediaByCategory("foto");

  return (
    <PublicShell title="Foto" description="Portofoliu foto public cu afisare compacta.">
      <CategoryHero
        title="Foto"
        description="Pozele sunt mici in listare si curate la deschidere."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Foto"
            href={`/foto/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
