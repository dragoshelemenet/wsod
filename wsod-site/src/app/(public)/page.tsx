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
        <PublicCard
          title="Video"
          subtitle="Proiecte video publice"
          href="/video"
        />
        <PublicCard
          title="Foto"
          subtitle="Proiecte foto publice"
          href="/foto"
        />
        <PublicCard
          title="Grafica"
          subtitle="Proiecte grafice publice"
          href="/grafica"
        />
        <PublicCard
          title="Website"
          subtitle="Proiecte web publice"
          href="/website"
        />
        <PublicCard
          title="Meta Ads"
          subtitle="Campanii si creatii ads"
          href="/meta-ads"
        />
        <PublicCard
          title="Audio"
          subtitle="Before / after audio"
          href="/audio"
        />
      </PublicGrid>
    </PublicShell>
  );
}
