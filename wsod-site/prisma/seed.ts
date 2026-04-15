import { prisma } from "../src/lib/db/prisma";

async function main() {
  await prisma.mediaItem.deleteMany();
  await prisma.brand.deleteMany();

  const cocaCola = await prisma.brand.create({
    data: {
      name: "Coca-Cola",
      slug: "coca-cola",
    },
  });

  const samsung = await prisma.brand.create({
    data: {
      name: "Samsung",
      slug: "samsung",
    },
  });

  const ingBank = await prisma.brand.create({
    data: {
      name: "ING Bank",
      slug: "ing-bank",
    },
  });

  await prisma.mediaItem.createMany({
    data: [
      {
        title: "Coca-Cola Hero Campaign",
        slug: "coca-cola-hero-campaign",
        category: "video",
        type: "video",
        date: new Date("2026-04-01"),
        fileUrl: "/media/demo/coca-cola/test-video.mp4",
        thumbnailUrl: "/media/demo/coca-cola/test-photo.jpg",
        description: "Spot video pentru campanie principală.",
        brandId: cocaCola.id,
      },
      {
        title: "Coca-Cola Product Photos",
        slug: "coca-cola-product-photos",
        category: "foto",
        type: "image",
        date: new Date("2026-03-28"),
        fileUrl: "/media/demo/coca-cola/test-photo.jpg",
        thumbnailUrl: "/media/demo/coca-cola/test-photo.jpg",
        description: "Cadre foto de produs pentru social media.",
        brandId: cocaCola.id,
      },
      {
        title: "Samsung Launch Visual",
        slug: "samsung-launch-visual",
        category: "grafica",
        type: "graphic",
        date: new Date("2026-03-21"),
        fileUrl: "/media/demo/samsung/test-photo.jpg",
        thumbnailUrl: "/media/demo/samsung/test-photo.jpg",
        description: "Grafică promo pentru lansare.",
        brandId: samsung.id,
      },
      {
        title: "ING Bank Audio Identity",
        slug: "ing-bank-audio-identity",
        category: "audio",
        type: "audio",
        date: new Date("2026-03-11"),
        fileUrl: "/media/demo/ing-bank/test-audio.mp3",
        thumbnailUrl: "/media/demo/ing-bank/test-photo.jpg",
        description: "Identitate audio și sound branding.",
        brandId: ingBank.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });