type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Model: {slug}</h1>
        <p>Model detail page placeholder.</p>
      </section>
    </main>
  );
}
