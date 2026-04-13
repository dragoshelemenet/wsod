import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GraficaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Grafica", href: "/grafica" },
            { label: slug },
          ]}
        />
        <h1>Grafica: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect grafic. Aici va intra vizualul mare
          si eventual alte variante sau mockup-uri.
        </p>
      </section>
    </main>
  );
}
