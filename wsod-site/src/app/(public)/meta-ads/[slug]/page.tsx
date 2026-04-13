import { Breadcrumbs } from "@/components/shared/breadcrumbs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MetaAdsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Meta Ads", href: "/meta-ads" },
            { label: slug },
          ]}
        />
        <h1>Meta Ads: {slug}</h1>
        <p className="inner-description">
          Pagina individuala pentru proiect Meta Ads. Aici vor intra creatiile,
          vizualurile si detaliile campaniei.
        </p>
      </section>
    </main>
  );
}
