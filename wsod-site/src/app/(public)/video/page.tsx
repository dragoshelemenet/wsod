import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
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
        <PublicCard title="Video Project 01" subtitle="Video" href="/video/video-project-01" />
        <PublicCard title="Video Project 02" subtitle="Video" href="/video/video-project-02" />
        <PublicCard title="Video Project 03" subtitle="Video" href="/video/video-project-03" />
        <PublicCard title="Video Project 04" subtitle="Video" href="/video/video-project-04" />
        <PublicCard title="Video Project 05" subtitle="Video" href="/video/video-project-05" />
        <PublicCard title="Video Project 06" subtitle="Video" href="/video/video-project-06" />
      </PublicGrid>
    </PublicShell>
  );
}
