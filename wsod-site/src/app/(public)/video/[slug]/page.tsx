type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Video</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu pentru proiect video. In v2 aici intra preview mare, date compacte si media related.
          </p>
        </div>
      </section>
    </main>
  );
}
