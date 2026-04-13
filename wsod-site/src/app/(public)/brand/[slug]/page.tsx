import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Branduri", href: "/brand" },
            { label: slug },
          ]}
        />
        <h1>Brand: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru brand. Aici vor intra proiectele asociate
          acelui brand, cu paginare simpla.
        </p>
      </section>
    </main>
  );
}
