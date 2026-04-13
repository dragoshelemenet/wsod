import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Modele", href: "/model" },
            { label: slug },
          ]}
        />
        <h1>Model: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru model. Aici vor intra proiectele asociate
          acelui model, afisate curat si rapid.
        </p>
      </section>
    </main>
  );
}
