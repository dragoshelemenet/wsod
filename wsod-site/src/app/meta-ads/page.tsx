import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meta Ads | WSOD.PROD",
  description:
    "Portofoliu Meta Ads WSOD.PROD: materiale și creative din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/meta-ads",
  },
};

export default async function MetaAdsPage() {
  const items = await getMediaByCategoryFromDb("meta-ads");

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>META ADS</h1>
        <p className="inner-description">
          Toate materialele Meta Ads din toate brandurile, ordonate după dată.
        </p>

        <MediaGrid items={items} emptyText="Nu există materiale Meta Ads momentan." />
      </section>
    </main>
  );
}