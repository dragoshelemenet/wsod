import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import OwnerIntroCard from "@/components/media/OwnerIntroCard";
import MediaBreadcrumbs from "@/components/media/MediaBreadcrumbs";
import {
  getModelBySlugFromDb,
  getMediaByModelSlugFromDb,
  getRandomPhotoMediaFromDb,
} from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

const BASE_URL = "https://wsod.cloud";

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

  const title = model.seoTitle || `${model.name} | WSOD.PROD`;
  const description =
    model.metaDescription ||
    model.description ||
    `Materiale foto și conținut vizual pentru ${model.name}.`;
  const url = `${BASE_URL}/model/${model.slug}`;
  const image = model.portraitImageUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/model/${model.slug}`,
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

function buildPhotoGroups(items: Awaited<ReturnType<typeof getMediaByModelSlugFromDb>>) {
  const grouped = new Map<string, typeof items>();

  for (const item of items) {
    const key = item.groupLabel?.trim() || "Alte poze";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  return [...grouped.entries()]
    .map(([label, groupItems]) => ({
      label,
      items: [...groupItems].sort((a, b) => {
        const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        if (orderDiff !== 0) return orderDiff;
        return +new Date(b.date) - +new Date(a.date);
      }),
      groupOrder:
        groupItems.reduce((min, item) => Math.min(min, item.groupOrder ?? 0), Number.POSITIVE_INFINITY) || 0,
    }))
    .sort((a, b) => a.groupOrder - b.groupOrder || a.label.localeCompare(b.label));
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;

  const [model, sameModelItems, randomItems] = await Promise.all([
    getModelBySlugFromDb(slug),
    getMediaByModelSlugFromDb(slug, { limit: 96 }),
    getRandomPhotoMediaFromDb(6, slug),
  ]);

  if (!model) {
    notFound();
  }

  const photoItems = sameModelItems.filter((item) => item.category === "foto");
  const groupedPhotos = buildPhotoGroups(photoItems);

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

        {groupedPhotos.length ? (
          groupedPhotos.map((group) => (
            <div key={group.label} className="owner-folder-section">
              <div className="owner-folder-section-head">
                <h2>{group.label}</h2>
              </div>

              <MediaGrid
                items={group.items}
                emptyText="Nu există poze în acest grup momentan."
              />
            </div>
          ))
        ) : (
          <div className="owner-folder-section">
            <div className="owner-folder-section-head">
              <h2>Poze</h2>
            </div>

            <MediaGrid
              items={photoItems}
              emptyText="Nu există materiale pentru acest model momentan."
            />
          </div>
        )}

        <div className="model-page-actions">
          <Link href={`/foto?model=${model.slug}`} className="media-open-button">
            Vezi toate pozele cu {model.name}
          </Link>
        </div>

        <div className="owner-folder-section">
          <div className="owner-folder-section-head">
            <h2>Alte poze</h2>
          </div>

          <MediaGrid
            items={randomItems}
            emptyText="Nu există alte poze momentan."
          />

          <div className="model-page-actions">
            <Link href="/foto" className="media-link">
              Vezi toate pozele
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
