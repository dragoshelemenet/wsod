type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FotoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Foto item: {slug}</h1>
        <p>Foto detail page placeholder.</p>
      </section>
    </main>
  );
}
