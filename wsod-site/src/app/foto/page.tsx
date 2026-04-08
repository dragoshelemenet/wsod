import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const metadata: Metadata = {
  title: "Video | WSOD.PROD",
  description:
    "Portofoliu video WSOD.PROD: materiale video din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/video",
  },
};

export default async function VideoPage() {
  const items = await getMediaByCategoryFromDb("video");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>VIDEO</h1>
        <p className="inner-description">
          Toate materialele video din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există materiale video momentan."
        />
      </section>
    </main>
  );
}