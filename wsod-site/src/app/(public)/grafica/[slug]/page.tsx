type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Grafica item: {slug}</h1>
        <p>Grafica detail page placeholder.</p>
      </section>
    </main>
  );
}
