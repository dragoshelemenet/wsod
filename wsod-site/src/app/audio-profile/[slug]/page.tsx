import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import {
  getAudioProfileBySlugFromDb,
  getMediaByAudioProfileSlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

interface AudioProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AudioProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getAudioProfileBySlugFromDb(slug);

  if (!profile) {
    return {
      title: "Audio Profile | WSOD.PROD",
    };
  }

  return {
    title: profile.seoTitle || `${profile.name} | WSOD.PROD`,
    description:
      profile.metaDescription ||
      profile.description ||
      `Materiale audio pentru ${profile.name}.`,
    alternates: {
      canonical: `/audio-profile/${profile.slug}`,
    },
  };
}

export default async function AudioProfilePage({
  params,
}: AudioProfilePageProps) {
  const { slug } = await params;

  const [profile, items] = await Promise.all([
    getAudioProfileBySlugFromDb(slug),
    getMediaByAudioProfileSlugFromDb(slug, { limit: 48 }),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>{profile.name}</h1>

        <p className="inner-description">
          {profile.description ||
            `Toate materialele disponibile pentru ${profile.name} (${profile.kind}).`}
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există materiale pentru acest profil audio momentan."
        />
      </section>
    </main>
  );
}
