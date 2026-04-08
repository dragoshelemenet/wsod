import Link from "next/link";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategory } from "@/lib/data/media-data";

export default function WebsitePage() {
  const items = getMediaByCategory("website");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>WEBSITE</h1>
        <p className="inner-description">
          Toate proiectele website din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există proiecte website momentan."
        />
      </section>
    </main>
  );
}