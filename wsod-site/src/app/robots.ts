import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio-dashboard", "/studio-login", "/api/"],
      },
    ],
    sitemap: "https://wsod.cloud/sitemap.xml",
  };
}
