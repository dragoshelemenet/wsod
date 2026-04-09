import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grafica | WSOD.PROD",
  description:
    "Portofoliu grafică WSOD.PROD: materiale grafice pentru branduri, social media și campanii vizuale.",
  alternates: {
    canonical: "/grafica",
  },
};

export default async function GraficaPage() {
  const items = await getMediaByCategoryFromDb("grafica", { limit: 36 });

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
          Portofoliu de materiale grafice realizate pentru branduri, social media și proiecte vizuale.
        </p>

        <MediaGrid
          items={items}
          emptyText="Nu există materiale grafice momentan."
        />
      </section>
    </main>
  );
}
