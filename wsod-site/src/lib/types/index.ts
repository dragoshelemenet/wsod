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
  slug: string;
  category: CategorySlug;
  type: "image" | "video" | "audio" | "website" | "graphic";
  date: string;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
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

export interface DbOwner {
  type: "brand" | "model" | "audioProfile" | "unknown";
  name: string;
  slug: string | null;
  audioKind?: string | null;
}

export interface DbMediaCardItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  date: Date;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fileUrl: string | null;
  fileNameOriginal: string | null;
  description: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  brand: {
    name: string;
    slug: string;
  } | null;
  personModel: {
    name: string;
    slug: string;
  } | null;
  audioProfile: {
    name: string;
    slug: string;
    kind: string;
  } | null;
  owner: DbOwner;
}
