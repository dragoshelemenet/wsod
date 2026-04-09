export type LocalMediaItem = {
  id: string;
  title: string;
  slug: string;
  brandSlug: string;
  category: string;
  type: string;
  date: string;
  fileUrl?: string;
  thumbnail?: string;
  description?: string;
};

export const defaultMediaItems: LocalMediaItem[] = [
  {
    id: "1",
    slug: "coca-cola-hero-campaign",
    title: "Coca-Cola Hero Campaign",
    brandSlug: "coca-cola",
    category: "video",
    type: "video",
    date: "2026-04-01",
    fileUrl: "/media/demo/coca-cola/test-video.mp4",
    thumbnail: "/media/demo/coca-cola/test-photo.jpg",
    description: "Spot video pentru campanie principală.",
  },
  {
    id: "2",
    slug: "coca-cola-product-photos",
    title: "Coca-Cola Product Photos",
    brandSlug: "coca-cola",
    category: "foto",
    type: "image",
    date: "2026-03-28",
    fileUrl: "/media/demo/coca-cola/test-photo.jpg",
    thumbnail: "/media/demo/coca-cola/test-photo.jpg",
    description: "Cadre foto de produs pentru social media.",
  },
  {
    id: "3",
    slug: "samsung-launch-visual",
    title: "Samsung Launch Visual",
    brandSlug: "samsung",
    category: "grafica",
    type: "graphic",
    date: "2026-03-21",
    fileUrl: "/media/demo/samsung/test-photo.jpg",
    thumbnail: "/media/demo/samsung/test-photo.jpg",
    description: "Grafică promo pentru lansare.",
  },
  {
    id: "4",
    slug: "samsung-website-landing",
    title: "Samsung Website Landing",
    brandSlug: "samsung",
    category: "website",
    type: "website",
    date: "2026-03-18",
    description: "Concept de landing page pentru campanie.",
  },
  {
    id: "5",
    slug: "ing-bank-audio-identity",
    title: "ING Bank Audio Identity",
    brandSlug: "ing-bank",
    category: "audio",
    type: "audio",
    date: "2026-03-11",
    fileUrl: "/media/demo/ing-bank/test-audio.mp3",
    description: "Identitate audio și sound branding.",
  },
  {
    id: "6",
    slug: "ing-bank-reels-edit",
    title: "ING Bank Reels Edit",
    brandSlug: "ing-bank",
    category: "video",
    type: "video",
    date: "2026-03-09",
    fileUrl: "/media/demo/ing-bank/test-video.mp4",
    thumbnail: "/media/demo/ing-bank/test-photo.jpg",
    description: "Montaj reels vertical pentru social media.",
  },
  {
    id: "7",
    slug: "samsung-studio-photos",
    title: "Samsung Studio Photos",
    brandSlug: "samsung",
    category: "foto",
    type: "image",
    date: "2026-03-02",
    fileUrl: "/media/demo/samsung/test-photo.jpg",
    thumbnail: "/media/demo/samsung/test-photo.jpg",
    description: "Set foto studio pentru produs.",
  },
  {
    id: "8",
    slug: "coca-cola-meta-ads-set",
    title: "Coca-Cola Meta Ads Set",
    brandSlug: "coca-cola",
    category: "meta-ads",
    type: "graphic",
    date: "2026-02-24",
    fileUrl: "/media/demo/coca-cola/test-photo.jpg",
    thumbnail: "/media/demo/coca-cola/test-photo.jpg",
    description: "Set creativ pentru campanii Meta Ads.",
  },
];

export const mediaItems = defaultMediaItems;

export function getMediaByCategory(category: string, items: LocalMediaItem[] = mediaItems) {
  return items
    .filter((item) => item.category === category)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getMediaByBrand(brandSlug: string, items: LocalMediaItem[] = mediaItems) {
  return items
    .filter((item) => item.brandSlug === brandSlug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}