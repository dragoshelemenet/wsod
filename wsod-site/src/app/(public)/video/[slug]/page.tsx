import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VideoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Video", href: "/video" },
            { label: slug },
          ]}
        />
        <h1>Video: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect video. Aici va intra playerul mare,
          preview-ul si galeria asociata.
        </p>
      </section>
    </main>
  );
}
