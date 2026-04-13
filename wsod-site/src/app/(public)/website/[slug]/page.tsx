type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Website: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect web. Aici va intra preview mare,
          link live si eventual render-ul intern al site-ului.
        </p>
      </section>
    </main>
  );
}
