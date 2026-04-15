import { prisma } from "@/lib/prisma";

export async function getPublishedBrands() {
  try {
    return await prisma.brand.findMany({
      where: { isVisible: true },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        mediaItems: {
          where: { isVisible: true },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getPublishedModels() {
  try {
    return await prisma.personModel.findMany({
      where: { isVisible: true },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        mediaItems: {
          where: { isVisible: true },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getPublishedMediaByCategory(category: string) {
  try {
    return await prisma.mediaItem.findMany({
      where: {
        isVisible: true,
        category,
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getPublishedMediaBySlug(slug: string) {
  try {
    return await prisma.mediaItem.findFirst({
      where: {
        isVisible: true,
        slug,
      },
      include: {
        brand: true,
        personModel: true,
        audioProfile: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getPublishedBrandBySlug(slug: string) {
  try {
    return await prisma.brand.findFirst({
      where: {
        isVisible: true,
        slug,
      },
      include: {
        mediaItems: {
          where: { isVisible: true },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getPublishedModelBySlug(slug: string) {
  try {
    return await prisma.personModel.findFirst({
      where: {
        isVisible: true,
        slug,
      },
      include: {
        mediaItems: {
          where: { isVisible: true },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getHomepageCollections() {
  try {
    const [video, foto, grafica, website, metaAds, audio] = await Promise.all([
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "video" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "foto" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "grafica" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "website" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "meta-ads" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.mediaItem.findMany({
        where: { isVisible: true, category: "audio" },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
    ]);

    return { video, foto, grafica, website, metaAds, audio };
  } catch {
    return {
      video: [],
      foto: [],
      grafica: [],
      website: [],
      metaAds: [],
      audio: [],
    };
  }
}

export async function getDashboardOverviewCounts() {
  try {
    const [media, brands, models, audio] = await Promise.all([
      prisma.mediaItem.count(),
      prisma.brand.count(),
      prisma.personModel.count(),
      prisma.mediaItem.count({
        where: { category: "audio" },
      }),
    ]);

    return { media, brands, models, audio };
  } catch {
    return { media: 0, brands: 0, models: 0, audio: 0 };
  }
}

export async function getDashboardMediaItems() {
  try {
    return await prisma.mediaItem.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        brand: true,
        personModel: true,
        audioProfile: true,
      },
      take: 100,
    });
  } catch {
    return [];
  }
}

export async function getDashboardBrands() {
  try {
    return await prisma.brand.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        mediaItems: {
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
      take: 100,
    });
  } catch {
    return [];
  }
}

export async function getDashboardModels() {
  try {
    return await prisma.personModel.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        mediaItems: {
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
      take: 100,
    });
  } catch {
    return [];
  }
}

export async function getDashboardAudioProfiles() {
  try {
    return await prisma.audioProfile.findMany({
      where: { isVisible: true },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      take: 100,
    });
  } catch {
    return [];
  }
}

export async function getSiteContentRecord() {
  try {
    return await prisma.siteContent.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return null;
  }
}

export async function getDashboardBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      take: 100,
    });
  } catch {
    return [];
  }
}

export async function getDashboardBlogPostById(id: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { id },
    });
  } catch {
    return null;
  }
}
