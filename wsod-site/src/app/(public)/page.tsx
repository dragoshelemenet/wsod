import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default function HomePage() {
  return (
    <PublicShell
      title="WSOD"
      description="Portofoliu public pentru video, foto, grafica, website, meta ads si audio."
    >
      <PublicGrid>
        <PublicCard title="Video" subtitle="Proiecte video publice" />
        <PublicCard title="Foto" subtitle="Proiecte foto publice" />
        <PublicCard title="Grafica" subtitle="Proiecte grafice publice" />
        <PublicCard title="Website" subtitle="Proiecte web publice" />
        <PublicCard title="Meta Ads" subtitle="Campanii si creatii ads" />
        <PublicCard title="Audio" subtitle="Before / after audio" />
      </PublicGrid>
    </PublicShell>
  );
}
