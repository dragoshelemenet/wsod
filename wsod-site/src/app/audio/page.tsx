import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const metadata: Metadata = {
  title: "Audio | WSOD.PROD",
  description:
    "Portofoliu audio WSOD.PROD: materiale audio din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/audio",
  },
};

export default async function AudioPage() {
  const items = await getMediaByCategoryFromDb("audio");

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

        <MediaGrid
          items={items}
          emptyText="Nu există materiale audio momentan."
        />
      </section>
    </main>
  );
}