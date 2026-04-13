import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";
import { getHomepageCollections } from "@/lib/dashboard/queries";

export default async function HomePage() {
  const data = await getHomepageCollections();

  const sections = [
    {
      title: "Video",
      subtitle: `${data.video.length} proiecte`,
      href: "/video",
      imageUrl: data.video[0]?.thumbnailUrl || data.video[0]?.previewUrl || data.video[0]?.fileUrl || null,
    },
    {
      title: "Foto",
      subtitle: `${data.foto.length} proiecte`,
      href: "/foto",
      imageUrl: data.foto[0]?.thumbnailUrl || data.foto[0]?.previewUrl || data.foto[0]?.fileUrl || null,
    },
    {
      title: "Grafica",
      subtitle: `${data.grafica.length} proiecte`,
      href: "/grafica",
      imageUrl: data.grafica[0]?.thumbnailUrl || data.grafica[0]?.previewUrl || data.grafica[0]?.fileUrl || null,
    },
    {
      title: "Website",
      subtitle: `${data.website.length} proiecte`,
      href: "/website",
      imageUrl: data.website[0]?.thumbnailUrl || data.website[0]?.previewUrl || data.website[0]?.fileUrl || null,
    },
    {
      title: "Meta Ads",
      subtitle: `${data.metaAds.length} proiecte`,
      href: "/meta-ads",
      imageUrl: data.metaAds[0]?.thumbnailUrl || data.metaAds[0]?.previewUrl || data.metaAds[0]?.fileUrl || null,
    },
    {
      title: "Audio",
      subtitle: `${data.audio.length} proiecte`,
      href: "/audio",
      imageUrl: data.audio[0]?.thumbnailUrl || data.audio[0]?.previewUrl || data.audio[0]?.fileUrl || null,
    },
  ];

  return (
    <PublicShell
      title="WSOD"
      description="Portofoliu public pentru video, foto, grafica, website, meta ads si audio."
    >
      <PublicGrid>
        {sections.map((section) => (
          <PublicCard
            key={section.href}
            title={section.title}
            subtitle={section.subtitle}
            href={section.href}
            imageUrl={section.imageUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
