import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const metadata: Metadata = {
  title: "Grafică | WSOD.PROD",
  description:
    "Portofoliu grafică WSOD.PROD: materiale grafice din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/grafica",
  },
};

export default async function GraficaPage() {
  const items = await getMediaByCategoryFromDb("grafica");

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