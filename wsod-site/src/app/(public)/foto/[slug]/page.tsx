type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FotoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Foto</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu foto. In v2 aici vin imagini mari in viewer rapid, fara clutter inutil.
          </p>
        </div>
      </section>
    </main>
  );
}
