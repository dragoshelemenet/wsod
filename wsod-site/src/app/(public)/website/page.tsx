import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
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
        <MediaFileCard title="Website Project 01" category="Website" />
        <MediaFileCard title="Website Project 02" category="Website" />
        <MediaFileCard title="Website Project 03" category="Website" />
        <MediaFileCard title="Website Project 04" category="Website" />
      </PublicGrid>
    </PublicShell>
  );
}
