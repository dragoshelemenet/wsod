type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Audio item: {slug}</h1>
        <p>Audio detail page placeholder.</p>
      </section>
    </main>
  );
}
