import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CardCarousel } from "@/components/site/card-carousel";

type ModelPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;

  const models = await prisma.personModel.findMany({
    where: { isVisible: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      portraitImageUrl: true,
      mediaItems: {
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }, { createdAt: "desc" }],
        take: 24,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  const currentIndex = models.findIndex((item) => item.slug === slug);
  if (currentIndex === -1) notFound();

  const model = models[currentIndex];
  const prevModel = currentIndex > 0 ? models[currentIndex - 1] : null;
  const nextModel = currentIndex < models.length - 1 ? models[currentIndex + 1] : null;

  const modelMediaCards = model.mediaItems.map((item) => ({
    href: `/${item.category}/${item.slug}`,
    title: item.title,
    subtitle: model.name,
    imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || model.portraitImageUrl,
  }));

  const otherModelCards = models
    .filter((item) => item.slug !== model.slug)
    .map((item) => ({
      href: `/model/${item.slug}`,
      title: item.name,
      subtitle: `${item.mediaItems.length} items`,
      imageUrl:
        item.portraitImageUrl ||
        item.mediaItems[0]?.thumbnailUrl ||
        item.mediaItems[0]?.previewUrl ||
        item.mediaItems[0]?.fileUrl ||
        null,
    }));

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 80px" }}>
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

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(300px,0.9fr)",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            minHeight: 360,
            background: "#111",
            overflow: "hidden",
          }}
        >
          {model.portraitImageUrl || model.mediaItems[0]?.thumbnailUrl ? (
            <img
              src={
                model.portraitImageUrl ||
                model.mediaItems[0]?.thumbnailUrl ||
                model.mediaItems[0]?.previewUrl ||
                model.mediaItems[0]?.fileUrl ||
                ""
              }
              alt={model.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            padding: 24,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Model</div>
          <h1 style={{ fontSize: 40, lineHeight: 1, margin: "0 0 16px" }}>{model.name}</h1>
          <p style={{ opacity: 0.82, lineHeight: 1.6 }}>
            {model.description || "Portofoliu model + lucrari asociate acestui model."}
          </p>

          <div style={{ marginTop: 20, opacity: 0.72 }}>
            {model.mediaItems.length} lucrări vizibile
          </div>
        </div>
      </section>

      <CardCarousel title={`Mai multe cu ${model.name}`} items={modelMediaCards} />
      <CardCarousel title="Alte modele" items={otherModelCards} />
    </main>
  );
}
