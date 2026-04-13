type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Model</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de model va grupa lucrarile pentru modelul respectiv, cu thumbnail-uri compacte si deschidere rapida.
          </p>
        </div>
      </section>
    </main>
  );
}
