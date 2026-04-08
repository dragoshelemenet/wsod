import { prisma } from "@/lib/db/prisma";

export async function getBrandsFromDb() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getBrandBySlugFromDb(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
  });
}

export async function getMediaByCategoryFromDb(category: string) {
  return prisma.mediaItem.findMany({
    where: { category },
    include: { brand: true },
    orderBy: { date: "desc" },
  });
}

export async function getMediaByBrandSlugFromDb(slug: string) {
  return prisma.mediaItem.findMany({
    where: {
      brand: {
        slug,
      },
    },
    include: { brand: true },
    orderBy: { date: "desc" },
  });
}