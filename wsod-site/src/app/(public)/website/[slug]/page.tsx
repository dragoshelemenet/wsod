type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Website: {slug}</h1>
        <p>Pagina individuala pentru proiect web.</p>
      </section>
    </main>
  );
}
