import { MetadataRoute } from "next";
import { homeCategories } from "@/lib/data/home-data";
import { getAllBlogPosts } from "@/lib/data/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";

  const staticRoutes = [
    "",
    "/blog",
    "/studio-login",
    ...homeCategories.map((category) => `/${category.slug}`),
    ...getAllBlogPosts().map((post) => `/blog/${post.slug}`),
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));
}