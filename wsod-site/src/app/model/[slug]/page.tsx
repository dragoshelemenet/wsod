import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerIntroCard from "@/components/media/OwnerIntroCard";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getModelBySlugFromDb,
  getMediaByModelSlugFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

interface ModelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlugFromDb(slug);

  if (!model) {
    return {
      title: "Model | WSOD.PROD",
    };
  }

  return {
    title: model.seoTitle || `${model.name} | WSOD.PROD`,
    description:
      model.metaDescription ||
      model.description ||
      `Materiale foto și conținut vizual pentru ${model.name}.`,
    alternates: {
      canonical: `/model/${model.slug}`,
    },
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;

  const [model, items] = await Promise.all([
    getModelBySlugFromDb(slug),
    getMediaByModelSlugFromDb(slug, { limit: 48 }),
  ]);

  if (!model) {
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
          categoryLabel="Modele"
          categoryHref="/foto"
          currentTitle={model.name}
        />

        <OwnerIntroCard
          title={model.name}
          description={model.description}
          imageUrl={model.portraitImageUrl || null}
          metaLine="Model page"
        />

        <MediaGrid
          items={items}
          emptyText="Nu există materiale pentru acest model momentan."
        />
      </section>
    </main>
  );
}
