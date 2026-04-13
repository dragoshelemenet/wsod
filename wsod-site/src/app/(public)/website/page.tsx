import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function WebsitePage() {
  const items = await getPublishedMediaByCategory("website");

  return (
    <PublicShell title="Website" description="Portofoliu public pentru proiecte web.">
      <PublicGrid dense>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            href={`/website/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
            imageOnly
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
