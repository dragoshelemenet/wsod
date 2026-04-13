type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Audio</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu audio. In v2 aici va exista comparatie before / after si player clar.
          </p>
        </div>
      </section>
    </main>
  );
}
