import { MediaItem } from "@/lib/types";

export const mediaItems: MediaItem[] = [
  {
    id: "1",
    title: "Coca-Cola Hero Campaign",
    brandSlug: "coca-cola",
    category: "video",
    type: "video",
    date: "2026-04-01",
    description: "Spot video pentru campanie principală.",
  },
  {
    id: "2",
    title: "Coca-Cola Product Photos",
    brandSlug: "coca-cola",
    category: "foto",
    type: "image",
    date: "2026-03-28",
    description: "Cadre foto de produs pentru social media.",
  },
  {
    id: "3",
    title: "Samsung Launch Visual",
    brandSlug: "samsung",
    category: "grafica",
    type: "graphic",
    date: "2026-03-21",
    description: "Grafică promo pentru lansare.",
  },
  {
    id: "4",
    title: "Samsung Website Landing",
    brandSlug: "samsung",
    category: "website",
    type: "website",
    date: "2026-03-18",
    description: "Concept de landing page pentru campanie.",
  },
  {
    id: "5",
    title: "ING Bank Audio Identity",
    brandSlug: "ing-bank",
    category: "audio",
    type: "audio",
    date: "2026-03-11",
    description: "Identitate audio și sound branding.",
  },
  {
    id: "6",
    title: "ING Bank Reels Edit",
    brandSlug: "ing-bank",
    category: "video",
    type: "video",
    date: "2026-03-09",
    description: "Montaj reels vertical pentru social media.",
  },
  {
    id: "7",
    title: "Samsung Studio Photos",
    brandSlug: "samsung",
    category: "foto",
    type: "image",
    date: "2026-03-02",
    description: "Set foto studio pentru produs.",
  },
  {
    id: "8",
    title: "Coca-Cola Meta Ads Set",
    brandSlug: "coca-cola",
    category: "meta-ads",
    type: "graphic",
    date: "2026-02-24",
    description: "Set creativ pentru campanii Meta Ads.",
  },
];

export function getMediaByCategory(category: string) {
  return mediaItems
    .filter((item) => item.category === category)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getMediaByBrand(brandSlug: string) {
  return mediaItems
    .filter((item) => item.brandSlug === brandSlug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}