import { prisma } from "@/lib/db/prisma";
import { DbMediaCardItem } from "@/lib/types";

function withOwner<T extends {
  brand: { name: string; slug: string; isVisible?: boolean } | null;
  personModel: { name: string; slug: string; isVisible?: boolean } | null;
  audioProfile: { name: string; slug: string; kind: string; isVisible?: boolean } | null;
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

function getPreviewSrc(item: {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
}) {
  return item.thumbnailUrl ?? item.previewUrl ?? item.fileUrl ?? null;
}

async function getVisibleSectionKeys() {
  const sections = await prisma.siteSectionVisibility.findMany({
    where: { isVisible: true },
    select: { key: true },
  });

  return new Set(sections.map((section) => section.key));
}

function buildVisibleMediaWhere(category?: string) {
  return {
    ...(category ? { category } : {}),
    isVisible: true,
    OR: [
      { brandId: null, personModelId: null, audioProfileId: null },
      { brand: { is: { isVisible: true } } },
      { personModel: { is: { isVisible: true } } },
      { audioProfile: { is: { isVisible: true } } },
    ],
  };
}

export async function getBrandsFromDb() {
  return prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
  });
}

export async function getBrandsWithHomePreviewFromDb() {
  const brands = await prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    include: {
      mediaItems: {
        where: {
          isVisible: true,
        },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }],
        take: 3,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  return brands.map((brand) => ({
    ...brand,
    previewImages: brand.mediaItems.map(getPreviewSrc).filter(Boolean) as string[],
  }));
}

export async function getBrandsWithHomePreviewFromDb() {
  const brands = await prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    include: {
      mediaItems: {
        where: {
          isVisible: true,
        },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }],
        take: 3,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  return brands.map((brand) => ({
    ...brand,
    previewImages: brand.mediaItems.map(getPreviewSrc).filter(Boolean) as string[],
  }));
}

export async function getModelsFromDb() {
  return prisma.personModel.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
  });
}

export async function getBrandsWithCategoryPreviewFromDb(category: string) {
  const sectionKeys = await getVisibleSectionKeys();
  if (!sectionKeys.has(category)) return [];

  const brands = await prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    include: {
      mediaItems: {
        where: buildVisibleMediaWhere(category),
        orderBy: { date: "desc" },
        take: 3,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  return brands.map((brand) => ({
    ...brand,
    previewImages: brand.mediaItems.map(getPreviewSrc).filter(Boolean) as string[],
  }));
}

export async function getModelsWithCategoryPreviewFromDb(category: string) {
  const sectionKeys = await getVisibleSectionKeys();
  if (!sectionKeys.has(category)) return [];

  const models = await prisma.personModel.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
    include: {
      mediaItems: {
        where: buildVisibleMediaWhere(category),
        orderBy: { date: "desc" },
        take: 3,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  return models.map((model) => ({
    ...model,
    previewImages: model.mediaItems.map(getPreviewSrc).filter(Boolean) as string[],
  }));
}

export async function getAudioProfilesFromDb() {
  return prisma.audioProfile.findMany({
    where: { isVisible: true },
    orderBy: { name: "asc" },
  });
}

export async function getBrandBySlugFromDb(slug: string) {
  return prisma.brand.findFirst({
    where: { slug, isVisible: true },
  });
}

export async function getModelBySlugFromDb(slug: string) {
  return prisma.personModel.findFirst({
    where: { slug, isVisible: true },
  });
}

export async function getAudioProfileBySlugFromDb(slug: string) {
  return prisma.audioProfile.findFirst({
    where: { slug, isVisible: true },
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
  const sectionKeys = await getVisibleSectionKeys();
  if (!sectionKeys.has(category)) return [];

  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      ...buildVisibleMediaWhere(category),
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
      ...buildVisibleMediaWhere(),
      brand: {
        slug,
        isVisible: true,
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
      ...buildVisibleMediaWhere(),
      personModel: {
        slug,
        isVisible: true,
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

export async function getRandomPhotoMediaFromDb(limit = 6, excludeModelSlug?: string) {
  const candidates = await prisma.mediaItem.findMany({
    where: {
      ...buildVisibleMediaWhere("foto"),
      ...(excludeModelSlug
        ? {
            NOT: {
              personModel: {
                slug: excludeModelSlug,
              },
            },
          }
        : {}),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 60,
  });

  const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, limit);
  return withOwner(shuffled);
}

export async function getMediaByAudioProfileSlugFromDb(slug: string, options?: MediaQueryOptions) {
  const { take, skip, orderBy } = buildMediaQueryOptions(options);

  const items = await prisma.mediaItem.findMany({
    where: {
      ...buildVisibleMediaWhere(),
      audioProfile: {
        slug,
        isVisible: true,
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

export async function getMediaItemBySlugFromDb(slug: string) {
  const item = await prisma.mediaItem.findFirst({
    where: {
      slug,
      ...buildVisibleMediaWhere(),
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
  });

  if (!item) return null;
  return withOwner([item])[0];
}

export async function getRelatedMediaByCategoryFromDb(
  category: string,
  currentId: string,
  limit = 12
) {
  const sectionKeys = await getVisibleSectionKeys();
  if (!sectionKeys.has(category)) return [];

  const items = await prisma.mediaItem.findMany({
    where: {
      ...buildVisibleMediaWhere(category),
      id: {
        not: currentId,
      },
    },
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
  });

  return withOwner(items);
}

export async function getRandomMediaByCategoryFromDb(
  category: string,
  limit = 6,
  excludeOwner?: { type: "brand" | "model" | "audioProfile"; slug?: string | null }
) {
  const sectionKeys = await getVisibleSectionKeys();
  if (!sectionKeys.has(category)) return [];

  const whereBase: any = buildVisibleMediaWhere(category);

  if (excludeOwner?.slug) {
    if (excludeOwner.type === "brand") {
      whereBase.NOT = { brand: { slug: excludeOwner.slug } };
    }

    if (excludeOwner.type === "model") {
      whereBase.NOT = { personModel: { slug: excludeOwner.slug } };
    }

    if (excludeOwner.type === "audioProfile") {
      whereBase.NOT = { audioProfile: { slug: excludeOwner.slug } };
    }
  }

  const candidates = await prisma.mediaItem.findMany({
    where: whereBase,
    include: {
      brand: true,
      personModel: true,
      audioProfile: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 60,
  });

  const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, limit);
  return withOwner(shuffled);
}

export async function getHomeCategoryPreviewMap() {
  const visibleKeys = await getVisibleSectionKeys();
  const categories = ["video", "foto", "grafica", "website", "meta-ads", "audio"] as const;

  const entries = await Promise.all(
    categories.map(async (category) => {
      if (!visibleKeys.has(category)) {
        return [category, []] as const;
      }

      const items = await prisma.mediaItem.findMany({
        where: buildVisibleMediaWhere(category),
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }],
        take: 3,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      });

      const previews = items.map((item) => getPreviewSrc(item)).filter(Boolean) as string[];
      return [category, previews] as const;
    })
  );

  return Object.fromEntries(entries) as Record<string, string[]>;
}

export async function getVisibleSiteSectionsFromDb() {
  return prisma.siteSectionVisibility.findMany({
    orderBy: { label: "asc" },
  });
}