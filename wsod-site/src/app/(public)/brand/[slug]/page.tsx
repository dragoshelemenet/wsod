type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Brand</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de brand va grupa proiectele publicate pentru acel brand, cu grid compact si paginare rapida.
          </p>
        </div>
      </section>
    </main>
  );
}
