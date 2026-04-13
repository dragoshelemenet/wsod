type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Brand: {slug}</h1>
        <p>Brand detail page placeholder.</p>
      </section>
    </main>
  );
}
