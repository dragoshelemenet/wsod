type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FotoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Foto: {slug}</h1>
        <p>Pagina individuala pentru proiect foto.</p>
      </section>
    </main>
  );
}
