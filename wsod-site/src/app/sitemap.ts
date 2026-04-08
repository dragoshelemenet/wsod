import { MetadataRoute } from "next";
import { featuredBrands, homeCategories } from "@/lib/data/home-data";
import { getAllBlogPosts } from "@/lib/data/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";

  const staticRoutes = [
    "",
    "/blog",
    ...homeCategories.map((category) => `/${category.slug}`),
    ...featuredBrands.map((brand) => `/brand/${brand.slug}`),
    ...getAllBlogPosts().map((post) => `/blog/${post.slug}`),
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}