import Link from "next/link";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Audio not found</h1>
          <p className="inner-description">Proiectul audio nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div className="detail-top-row">
          <Link href="/audio" className="detail-back-button" aria-label="Înapoi">←</Link>
          <h1>{item.title}</h1>
        </div>
        <p className="inner-description">
          {item.description || "Comparatie intre audio original si audio procesat."}
        </p>

        {item.fileUrl ? (
          <div className="media-detail-hero">
            <p className="inner-description">Inainte de procesare</p>
            <audio src={item.fileUrl} controls style={{ width: "100%" }} />
          </div>
        ) : null}

        {item.previewUrl ? (
          <div className="media-detail-hero">
            <p className="inner-description">Dupa procesare</p>
            <audio src={item.previewUrl} controls style={{ width: "100%" }} />
          </div>
        ) : null}
        <div className="detail-bottom-back">
          <Link href="/audio" className="detail-bottom-back-link">Înapoi la galerie</Link>
        </div>
      </section>
    </main>
  );
}
