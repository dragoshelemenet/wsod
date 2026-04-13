type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MetaAdsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Meta Ads item: {slug}</h1>
        <p>Meta Ads detail page placeholder.</p>
      </section>
    </main>
  );
}
