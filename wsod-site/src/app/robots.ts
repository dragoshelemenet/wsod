import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio-dashboard"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}