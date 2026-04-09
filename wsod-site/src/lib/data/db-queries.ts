import { prisma } from "@/lib/db/prisma";

export async function getBrandsFromDb() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getModelsFromDb() {
  return prisma.personModel.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getBrandBySlugFromDb(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
  });
}

export async function getModelBySlugFromDb(slug: string) {
  return prisma.personModel.findUnique({
    where: { slug },
  });
}

export async function getMediaByCategoryFromDb(category: string) {
  return prisma.mediaItem.findMany({
    where: { category },
    include: {
      brand: true,
      personModel: true,
    },
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
    include: {
      brand: true,
      personModel: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function getMediaByModelSlugFromDb(slug: string) {
  return prisma.mediaItem.findMany({
    where: {
      personModel: {
        slug,
      },
    },
    include: {
      brand: true,
      personModel: true,
    },
    orderBy: { date: "desc" },
  });
}