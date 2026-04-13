import { CategoryHero } from "@/components/public/category-hero";
import { PublicShell } from "@/components/public/public-shell";

export default function ServiciiPreturiPage() {
  return (
    <PublicShell
      title="Servicii si preturi"
      description="Pagina pentru servicii, pachete si preturi."
    >
      <CategoryHero
        title="Servicii si preturi"
        description="Aici vor fi listate serviciile, pachetele si preturile, intr-un mod clar si rapid."
      />
    </PublicShell>
  );
}
