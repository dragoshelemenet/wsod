import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FotoSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Foto", href: "/foto" },
            { label: slug },
          ]}
        />
        <h1>Foto: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect foto. Aici vor aparea imaginile mari,
          curate, fara aglomeratie inutila.
        </p>
      </section>
    </main>
  );
}
