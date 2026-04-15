import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const BASE_URL = "https://wsod.cloud";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, models, audioProfiles, mediaItems] = await Promise.all([
    prisma.brand.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.personModel.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.audioProfile.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.mediaItem.findMany({
      select: {
        slug: true,
        category: true,
        updatedAt: true,
      },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/foto`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/video`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/audio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/grafica`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/website`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/meta-ads`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${BASE_URL}/brand/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const modelRoutes: MetadataRoute.Sitemap = models.map((model) => ({
    url: `${BASE_URL}/model/${model.slug}`,
    lastModified: model.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const audioProfileRoutes: MetadataRoute.Sitemap = audioProfiles.map((profile) => ({
    url: `${BASE_URL}/audio-profile/${profile.slug}`,
    lastModified: profile.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const allowedItemCategories = [
    "foto",
    "video",
    "audio",
    "grafica",
    "website",
    "meta-ads",
  ];

  const mediaRoutes: MetadataRoute.Sitemap = mediaItems
    .filter((item) => allowedItemCategories.includes(item.category))
    .map((item) => ({
      url: `${BASE_URL}/${item.category}/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...audioProfileRoutes,
    ...mediaRoutes,
  ];
}
