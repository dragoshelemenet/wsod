import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function MetaAdsPage() {
  const items = await getPublishedMediaByCategory("meta-ads");

  return (
    <PublicShell title="Meta Ads" description="Portofoliu public pentru reclame si creatii ads.">
      <CategoryHero
        title="Meta Ads"
        description="Zona pentru creatii, vizualuri si rezultate Meta Ads."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Meta Ads"
            href={`/meta-ads/${item.slug}`}
            imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
