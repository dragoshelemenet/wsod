import Link from "next/link";
import { homeCategories } from "@/lib/data/home-data";
import { getHomeCategoryPreviewMap } from "@/lib/data/db-queries";

export default async function ServiceFolders() {
  const previewMap = await getHomeCategoryPreviewMap();

  return (
    <section className="section">
      <div className="folder-grid">
        {homeCategories.map((service) => {
          const previews = previewMap[service.slug] || [];

          return (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="folder-card folder-card-rich"
            >
              <div className="folder-top" />

              <div className="folder-body">
                <span>{service.title}</span>
              </div>

              {previews.length ? (
                <div className="folder-hover-preview" aria-hidden="true">
                  {previews.slice(0, 3).map((src, index) => (
                    <div
                      key={`${service.slug}-${index}-${src}`}
                      className={`folder-hover-shot folder-hover-shot-${index + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
