import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function MetaAdsPage() {
  return (
    <PublicShell title="Meta Ads" description="Portofoliu public pentru reclame si creatii ads.">
      <CategoryHero
        title="Meta Ads"
        description="Zona pentru creatii, vizualuri si rezultate Meta Ads."
      />
      <PublicGrid>
        <MediaFileCard title="Meta Ads Project 01" category="Meta Ads" />
        <MediaFileCard title="Meta Ads Project 02" category="Meta Ads" />
        <MediaFileCard title="Meta Ads Project 03" category="Meta Ads" />
        <MediaFileCard title="Meta Ads Project 04" category="Meta Ads" />
      </PublicGrid>
    </PublicShell>
  );
}
