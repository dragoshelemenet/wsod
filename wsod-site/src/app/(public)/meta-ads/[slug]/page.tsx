type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MetaAdsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Meta Ads: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect Meta Ads. Aici vor intra creatiile,
          vizualurile si detaliile campaniei.
        </p>
      </section>
    </main>
  );
}
