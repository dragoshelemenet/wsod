import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
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
        <PublicCard title="Meta Ads Project 01" subtitle="Meta Ads" href="/meta-ads/meta-ads-project-01" />
        <PublicCard title="Meta Ads Project 02" subtitle="Meta Ads" href="/meta-ads/meta-ads-project-02" />
        <PublicCard title="Meta Ads Project 03" subtitle="Meta Ads" href="/meta-ads/meta-ads-project-03" />
        <PublicCard title="Meta Ads Project 04" subtitle="Meta Ads" href="/meta-ads/meta-ads-project-04" />
      </PublicGrid>
    </PublicShell>
  );
}
