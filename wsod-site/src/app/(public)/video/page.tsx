import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function VideoPage() {
  const items = await getPublishedMediaByCategory("video");

  return (
    <PublicShell title="Video" description="Portofoliu video public, rapid si curat.">
      <CategoryHero
        title="Video"
        description="Aici apar proiectele video publicate, afisate compact, fara descrieri inutile."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Video"
            href={`/video/${item.slug}`}
            imageUrl={item.coverUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
