import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function AudioPage() {
  return (
    <PublicShell title="Audio" description="Portofoliu audio cu before si after processing.">
      <CategoryHero
        title="Audio"
        description="Aici vor aparea proiectele audio cu comparatie intre sunetul initial si rezultatul final."
      />
      <PublicGrid>
        <PublicCard title="Audio Project 01" subtitle="Audio" href="/audio/audio-project-01" />
        <PublicCard title="Audio Project 02" subtitle="Audio" href="/audio/audio-project-02" />
        <PublicCard title="Audio Project 03" subtitle="Audio" href="/audio/audio-project-03" />
        <PublicCard title="Audio Project 04" subtitle="Audio" href="/audio/audio-project-04" />
      </PublicGrid>
    </PublicShell>
  );
}
