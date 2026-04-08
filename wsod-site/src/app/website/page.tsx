import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website | WSOD.PROD",
  description:
    "Portofoliu website WSOD.PROD: proiecte web din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/website",
  },
};

export default async function WebsitePage() {
  const items = await getMediaByCategoryFromDb("website");

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

        <MediaGrid items={items} emptyText="Nu există proiecte website momentan." />
      </section>
    </main>
  );
}