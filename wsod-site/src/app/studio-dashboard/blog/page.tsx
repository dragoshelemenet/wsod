import { DashboardBlogForm } from "@/components/dashboard/dashboard-blog-form";
import { DashboardBlogList } from "@/components/dashboard/dashboard-blog-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardBlogPosts } from "@/lib/dashboard/queries";

export default async function DashboardBlogPage() {
  const items = await getDashboardBlogPosts();

  return (
    <DashboardShell
      title="Blog"
      description="Administrare articole blog."
    >
      <DashboardBlogForm />
      <DashboardBlogList items={items} />
    </DashboardShell>
  );
}
