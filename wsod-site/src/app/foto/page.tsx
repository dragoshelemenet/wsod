import Link from "next/link";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategory } from "@/lib/data/media-data";

export default function FotoPage() {
  const items = getMediaByCategory("foto");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>PHOTO</h1>
        <p className="inner-description">
          Toate materialele foto din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid items={items} emptyText="Nu există materiale foto momentan." />
      </section>
    </main>
  );
}