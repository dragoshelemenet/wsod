type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Grafica</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu grafica. In v2 aici intra preview mare, itemuri similare si navigare rapida.
          </p>
        </div>
      </section>
    </main>
  );
}
