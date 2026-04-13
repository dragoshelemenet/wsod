import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function AudioPage() {
  const items = await getPublishedMediaByCategory("audio");

  return (
    <PublicShell title="Audio" description="Proiecte audio publicate.">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Audio"
            href={`/audio/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
           
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
