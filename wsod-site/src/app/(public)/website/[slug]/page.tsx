type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Website item: {slug}</h1>
        <p>Website detail page placeholder.</p>
      </section>
    </main>
  );
}
