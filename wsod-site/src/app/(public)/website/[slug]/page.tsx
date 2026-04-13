import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Website", href: "/website" },
            { label: slug },
          ]}
        />
        <h1>Website: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect web. Aici va intra preview mare,
          link live si eventual render-ul intern al site-ului.
        </p>
      </section>
    </main>
  );
}
