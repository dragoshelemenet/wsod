type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Grafica: {slug}</h1>
        <p>Pagina individuala pentru proiect de grafica.</p>
      </section>
    </main>
  );
}
