type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Model: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru model. Aici vor intra proiectele asociate
          acelui model, afisate curat si rapid.
        </p>
      </section>
    </main>
  );
}
