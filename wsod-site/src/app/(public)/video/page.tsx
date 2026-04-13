import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function VideoPage() {
  return (
    <PublicShell title="Video" description="Portofoliu video public, rapid si curat.">
      <CategoryHero
        title="Video"
        description="Aici vor aparea proiectele video publicate, afisate compact, fara descrieri inutile."
      />
      <PublicGrid>
        <MediaFileCard title="Video Project 01" category="Video" />
        <MediaFileCard title="Video Project 02" category="Video" />
        <MediaFileCard title="Video Project 03" category="Video" />
        <MediaFileCard title="Video Project 04" category="Video" />
        <MediaFileCard title="Video Project 05" category="Video" />
        <MediaFileCard title="Video Project 06" category="Video" />
      </PublicGrid>
    </PublicShell>
  );
}
