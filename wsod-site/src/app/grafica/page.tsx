import Link from "next/link";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategory } from "@/lib/data/media-data";

export default function GraficaPage() {
  const items = getMediaByCategory("grafica");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>GRAPHIC</h1>
        <p className="inner-description">
          Toate materialele grafice din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există materiale grafice momentan."
        />
      </section>
    </main>
  );
}