import { CategoryHero } from "@/components/public/category-hero";
import { MediaFileCard } from "@/components/public/media-file-card";
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
        <MediaFileCard title="Audio Project 01" category="Audio" />
        <MediaFileCard title="Audio Project 02" category="Audio" />
        <MediaFileCard title="Audio Project 03" category="Audio" />
        <MediaFileCard title="Audio Project 04" category="Audio" />
      </PublicGrid>
    </PublicShell>
  );
}
