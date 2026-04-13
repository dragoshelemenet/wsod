type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Audio: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect audio. Aici va intra player before,
          player after si comparatia clara intre ele.
        </p>
      </section>
    </main>
  );
}
