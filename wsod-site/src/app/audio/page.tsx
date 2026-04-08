import Link from "next/link";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategory } from "@/lib/data/media-data";

export default function AudioPage() {
  const items = getMediaByCategory("audio");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>AUDIO</h1>
        <p className="inner-description">
          Toate materialele audio din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid items={items} emptyText="Nu există materiale audio momentan." />
      </section>
    </main>
  );
}