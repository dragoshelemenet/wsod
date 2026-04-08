export type CategorySlug =
  | "video"
  | "foto"
  | "grafica"
  | "website"
  | "meta-ads"
  | "audio";

export interface Brand {
  name: string;
  slug: string;
}

export interface Category {
  title: string;
  slug: CategorySlug;
}

export interface MediaItem {
  id: string;
  title: string;
  brandSlug: string;
  category: CategorySlug;
  type: "image" | "video" | "audio" | "website" | "graphic";
  date: string;
  thumbnail?: string;
  fileUrl?: string;
  description?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  seoTitle?: string;
  metaDescription?: string;
}

export interface DbMediaCardItem {
  id: string;
  title: string;
  category: string;
  type: string;
  date: Date;
  thumbnail: string | null;
  fileUrl: string | null;
  description: string | null;
  brand: {
    name: string;
    slug: string;
  };
}