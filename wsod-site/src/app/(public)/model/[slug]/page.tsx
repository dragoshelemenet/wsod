import Link from "next/link";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { CardCarousel } from "@/components/site/card-carousel";
import { getPublishedModelBySlug } from "@/lib/dashboard/queries";
import { prisma } from "@/lib/db/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getPublishedModelBySlug(slug);

  if (!model) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Model not found</h1>
          <p className="inner-description">Modelul nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const allModels = await prisma.personModel.findMany({
    where: { isVisible: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      portraitImageUrl: true,
      mediaItems: {
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  const currentModelIndex = allModels.findIndex((item) => item.slug === model.slug);
  const prevModel = currentModelIndex > 0 ? allModels[currentModelIndex - 1] : null;
  const nextModel =
    currentModelIndex >= 0 && currentModelIndex < allModels.length - 1
      ? allModels[currentModelIndex + 1]
      : null;

  const sameModelCards = model.mediaItems.map((item) => ({
    href: `/${item.category}/${item.slug}`,
    title: item.title,
    subtitle: model.name,
    imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || model.portraitImageUrl,
  }));

  const otherModelCards = allModels
    .filter((item) => item.slug !== model.slug)
    .map((item) => ({
      href: `/model/${item.slug}`,
      title: item.name,
      subtitle: "Model",
      imageUrl:
        item.portraitImageUrl ||
        item.mediaItems[0]?.thumbnailUrl ||
        item.mediaItems[0]?.previewUrl ||
        item.mediaItems[0]?.fileUrl ||
        null,
    }));

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {prevModel ? (
              <Link
                href={`/model/${prevModel.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {"<"} {prevModel.name}
              </Link>
            ) : null}

            {nextModel ? (
              <Link
                href={`/model/${nextModel.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {nextModel.name} {">"}
              </Link>
            ) : null}
          </div>

          <Link
            href="/model"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "10px 14px",
              textDecoration: "none",
              color: "white",
            }}
          >
            Toate modelele
          </Link>
        </div>

        <h1>{model.name}</h1>
        <p className="inner-description">
          {model.description || "Portofoliu model + lucrari asociate acestui model."}
        </p>

        <PublicGrid dense>
          {model.mediaItems.map((item) => (
            <PublicCard
              key={item.id}
              title={item.title}
              href={`/${item.category}/${item.slug}`}
              imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
              imageOnly
            />
          ))}
        </PublicGrid>

        <CardCarousel title={`Mai multe cu ${model.name}`} items={sameModelCards} />
        <CardCarousel title="Alte modele" items={otherModelCards} />
      </section>
    </main>
  );
}
