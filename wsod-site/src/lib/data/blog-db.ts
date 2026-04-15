import { prisma } from "@/lib/db/prisma";

export async function getAllBlogPostsFromDb() {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getBlogPostBySlugFromDb(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      mediaLinks: {
        include: {
          mediaItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getAllBlogPostsForAdmin() {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      mediaLinks: {
        include: {
          mediaItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}
