type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VideoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>Video item: {slug}</h1>
        <p>Video detail page placeholder.</p>
      </section>
    </main>
  );
}
