import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerIntroCard from "@/components/media/OwnerIntroCard";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getAudioProfileBySlugFromDb,
  getMediaByAudioProfileSlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

const BASE_URL = "https://wsod.cloud";

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

  const title = profile.seoTitle || `${profile.name} | WSOD.PROD`;
  const description =
    profile.metaDescription ||
    profile.description ||
    `Materiale audio pentru ${profile.name}.`;
  const url = `${BASE_URL}/audio-profile/${profile.slug}`;
  const image = profile.coverImageUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/audio-profile/${profile.slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "WSOD.PROD",
      type: "profile",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
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
        <MediaBreadcrumbs
          categoryLabel="Audio Profiles"
          categoryHref="/audio"
          currentTitle={profile.name}
        />

        <OwnerIntroCard
          title={profile.name}
          description={profile.description}
          imageUrl={profile.coverImageUrl || null}
          metaLine={`Audio profile • ${profile.kind}`}
        />

        <MediaGrid
          items={items}
          emptyText="Nu există materiale pentru acest profil audio momentan."
        />
      </section>
    </main>
  );
}
