import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function WebsitePage() {
  return (
    <PublicShell title="Website" description="Portofoliu public pentru proiecte web.">
      <CategoryHero
        title="Website"
        description="Aici vor intra proiecte website, inclusiv preview si demo accesare site."
      />
      <PublicGrid>
        <PublicCard title="Website Project 01" subtitle="Website" href="/website/website-project-01" />
        <PublicCard title="Website Project 02" subtitle="Website" href="/website/website-project-02" />
        <PublicCard title="Website Project 03" subtitle="Website" href="/website/website-project-03" />
        <PublicCard title="Website Project 04" subtitle="Website" href="/website/website-project-04" />
      </PublicGrid>
    </PublicShell>
  );
}
