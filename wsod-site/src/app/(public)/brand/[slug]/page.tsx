type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Brand: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru brand. Aici vor intra proiectele asociate
          acelui brand, cu paginare simpla.
        </p>
      </section>
    </main>
  );
}
