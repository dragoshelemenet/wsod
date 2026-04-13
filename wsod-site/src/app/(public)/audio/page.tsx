import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function AudioPage() {
  const items = await getPublishedMediaByCategory("audio");

  return (
    <PublicShell title="Audio" description="Portofoliu audio cu before si after processing.">
      <CategoryHero
        title="Audio"
        description="Aici apar proiectele audio cu comparatie intre sunetul initial si rezultatul final."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Audio"
            href={`/audio/${item.slug}`}
            imageUrl={item.coverUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
