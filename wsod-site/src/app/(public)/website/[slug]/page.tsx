type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Website</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu website. In v2 aici va exista preview live sau embed optimizat.
          </p>
        </div>
      </section>
    </main>
  );
}
