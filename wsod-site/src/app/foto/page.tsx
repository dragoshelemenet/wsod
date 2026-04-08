import Link from "next/link";
import { Metadata } from "next";
import MediaGrid from "@/components/media/MediaGrid";
import { getMediaByCategoryFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Foto | WSOD.PROD",
  description:
    "Portofoliu foto WSOD.PROD: materiale foto din toate brandurile, ordonate după dată.",
  alternates: {
    canonical: "/foto",
  },
};

export default async function FotoPage() {
  const items = await getMediaByCategoryFromDb("foto");

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