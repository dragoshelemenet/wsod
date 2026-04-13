type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MetaAdsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="site-shell">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="page-kicker">Meta Ads</p>
          <h1>{slug.replace(/-/g, " ")}</h1>
          <p className="page-description">
            Pagina de detaliu Meta Ads. In v2 aici vin creativul, contextul si datele media asociate.
          </p>
        </div>
      </section>
    </main>
  );
}
