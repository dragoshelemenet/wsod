import Link from "next/link";
import { featuredBrands } from "@/lib/data/home-data";

export default function BrandsSection() {
  return (
    <section className="section brands-section">
      <h2>BRANDS WE WORKED WITH</h2>

      <div className="brand-grid">
        {featuredBrands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            className="brand-card"
          >
            <div className="folder-top" />
            <div className="folder-body brand-body">
              <span>{brand.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dots">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}