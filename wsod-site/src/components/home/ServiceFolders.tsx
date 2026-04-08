import Link from "next/link";
import { homeCategories } from "@/lib/data/home-data";

export default function ServiceFolders() {
  return (
    <section className="section">
      <div className="folder-grid">
        {homeCategories.map((service) => (
          <Link
            key={service.slug}
            href={`/${service.slug}`}
            className="folder-card"
          >
            <div className="folder-top" />
            <div className="folder-body">
              <span>{service.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}