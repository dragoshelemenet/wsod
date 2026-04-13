type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VideoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Video: {slug}</h1>
        <p>Pagina individuala pentru proiect video.</p>
      </section>
    </main>
  );
}
