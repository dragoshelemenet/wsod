import { prisma } from "@/lib/db/prisma";
import { DashboardBrandForm } from "@/components/dashboard/dashboard-brand-form";
import { DashboardBrandList } from "@/components/dashboard/dashboard-brand-list";

export default async function StudioDashboardBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell-head">
        <h1>Brands</h1>
        <p>Create, upload and edit brands from one place.</p>
      </div>

      <DashboardBrandForm />

      <DashboardBrandList
        brands={brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          coverImageUrl: brand.coverImageUrl,
          description: brand.description,
          isVisible: brand.isVisible,
        }))}
      />
    </div>
  );
}
