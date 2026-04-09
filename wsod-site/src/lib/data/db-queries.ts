import { prisma } from "@/lib/db/prisma";
import { DbMediaCardItem } from "@/lib/types";

function withOwner<T extends {
  brand: { name: string; slug: string } | null;
  personModel: { name: string; slug: string } | null;
  audioProfile: { name: string; slug: string; kind: string } | null;
}>(items: T[]): (T & { owner: DbMediaCardItem["owner"] })[] {
  return items.map((item) => {
    if (item.brand) {
      return {
        ...item,
        owner: {
          type: "brand" as const,
          name: item.brand.name,
          slug: item.brand.slug,
          audioKind: null,
        },
      };
    }

    if (item.personModel) {
      return {
        ...item,
        owner: {
          type: "model" as const,
          name: item.personModel.name,
          slug: item.personModel.slug,
          audioKind: null,
        },
      };
    }

    if (item.audioProfile) {
      return {
        ...item,
        owner: {
          type: "audioProfile" as const,
          name: item.audioProfile.name,
          slug: item.audioProfile.slug,
          audioKind: item.audioProfile.kind,
        },
      };
    }

    return {
      ...item,
      owner: {
        type: "unknown" as const,
        name: "Fără asociere",
        slug: null,
        audioKind: null,
      },
    };
  });
}

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

export async function getAudioProfilesFromDb() {
  return prisma.audioProfile.findMany({
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

export async function getAudioProfileBySlugFromDb(slug: string) {
  return prisma.audioProfile.findUnique({
    where: { slug },
  });
}

interface MediaQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: "newest" | "oldest";
}

function buildMediaQueryOptions(options?: MediaQueryOptions) {
  const take = options?.limit ?? 24;
  const skip = options?.offset ?? 0;
  const orderBy = { date: options?.sort === "oldest" ? "asc" : "desc" } as const;

  return { take, skip, orderBy };
}

function buildSearchWhere(search?: string) {
  if (!search?.trim()) {
    return {};
  }

  const q = search.trim();

  return {
    OR: [
      { title: { contains: q } },
      { description: { contains: q } },
      { seoTitle: { contains: q } },
      { metaDescription: { contains: q } },
      { fileNameOriginal: { contains: q } },
    ],
  };
}

export async function getMediaByCategoryFromDb(category: string, options?: MediaQueryOptions) {
  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      category,
      ...buildSearchWhere(options?.search),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy,
    take,
    skip,
  });

  return withOwner(items);
}

export async function getMediaByBrandSlugFromDb(slug: string, options?: MediaQueryOptions) {
  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      brand: {
        slug,
      },
      ...buildSearchWhere(options?.search),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy,
    take,
    skip,
  });

  return withOwner(items);
}

export async function getMediaByModelSlugFromDb(slug: string, options?: MediaQueryOptions) {
  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      personModel: {
        slug,
      },
      ...buildSearchWhere(options?.search),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy,
    take,
    skip,
  });

  return withOwner(items);
}

export async function getMediaByAudioProfileSlugFromDb(slug: string, options?: MediaQueryOptions) {
  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      audioProfile: {
        slug,
      },
      ...buildSearchWhere(options?.search),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy,
    take,
    skip,
  });

  return withOwner(items);
}