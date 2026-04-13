import Link from "next/link";

const cards = [
  {
    title: "Media",
    description: "Toate fisierele publice: video, foto, grafica, website, meta ads.",
    href: "/studio-dashboard/media",
  },
  {
    title: "Models",
    description: "Foldere pentru modele, organizate clar si usor de gasit.",
    href: "/studio-dashboard/models",
  },
  {
    title: "Brands",
    description: "Foldere pentru branduri, logo-uri si materiale asociate.",
    href: "/studio-dashboard/brands",
  },
  {
    title: "Audio",
    description: "Before / after, comparatie si publicare proiecte audio.",
    href: "/studio-dashboard/audio",
  },
  {
    title: "Upload",
    description: "Zona unica pentru incarcare rapida de fisiere si cover-uri.",
    href: "/studio-dashboard/upload",
  },
  {
    title: "SEO",
    description: "Meta title, descriere, OG image, canonical si control noindex.",
    href: "/studio-dashboard/seo",
  },
];

export default function DashboardHomePage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-page-head">
        <div>
          <p className="dashboard-kicker">Dashboard</p>
          <h1>Overview</h1>
          <p className="dashboard-description">
            Panou simplu pentru control rapid asupra continutului public si setarilor de prezentare.
          </p>
        </div>
      </section>

      <section className="dashboard-card-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="dashboard-card">
            <strong>{card.title}</strong>
            <span>{card.description}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
