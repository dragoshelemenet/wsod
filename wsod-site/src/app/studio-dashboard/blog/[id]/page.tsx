import { DashboardBlogEditForm } from "@/components/dashboard/dashboard-blog-edit-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardBlogPostById } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getDashboardBlogPostById(id);

  if (!item) {
    return (
      <DashboardShell
        title="Blog post not found"
        description="Articolul nu a fost gasit."
      />
    );
  }

  return (
    <DashboardShell
      title="Edit blog post"
      description="Editeaza continutul articolului."
    >
      <DashboardBlogEditForm item={item} />
    </DashboardShell>
  );
}
