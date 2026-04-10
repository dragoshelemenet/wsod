import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import {
  getAudioProfilesFromDb,
  getMediaByCategoryFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audio | WSOD.PROD",
  description:
    "Portofoliu audio WSOD.PROD organizat pe profile audio: artiști, podcasturi, show-uri și proiecte.",
  alternates: {
    canonical: "/audio",
  },
};

export default async function AudioPage() {
  const [audioProfiles, items] = await Promise.all([
    getAudioProfilesFromDb(),
    getMediaByCategoryFromDb("audio", { limit: 24 }),
  ]);

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>AUDIO</h1>
        <p className="inner-description">
          Portofoliu audio organizat pe profile audio: artiști, podcasturi, show-uri și proiecte.
        </p>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Selecții audio</h2>
          </div>

          <MediaGrid
            items={items}
            emptyText="Nu există materiale audio momentan."
          />
        </div>

        <OwnerFolderGrid
          title="Audio Profiles"
          items={audioProfiles.map((profile) => ({
            id: profile.id,
            name: profile.name,
            slug: profile.slug,
            imageUrl: profile.coverImageUrl ?? null,
            href: `/audio-profile/${profile.slug}?from=audio`,
            subtitle: profile.kind,
          }))}
          emptyText="Nu există profile audio momentan."
        />
      </section>
    </main>
  );
}
