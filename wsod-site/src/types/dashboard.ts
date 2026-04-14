export type PublicCategory =
  | "video"
  | "foto"
  | "grafica"
  | "website"
  | "meta-ads"
  | "audio";

export type FolderKind = "brand" | "model";

export type MediaKind =
  | "image"
  | "video"
  | "audio"
  | "website"
  | "graphic";

export interface PublicCardItem {
  id: string;
  title: string;
  slug: string;
  category: PublicCategory;
  coverUrl: string | null;
  brandSlug?: string | null;
  modelSlug?: string | null;
  year?: string | null;
  isFeatured?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  kind: MediaKind;
  category: PublicCategory;
  fileUrl: string;
  coverUrl?: string | null;
  beforeUrl?: string | null;
  afterUrl?: string | null;
  excerpt?: string | null;
  isPublished: boolean;
  createdAt?: string;
}

export interface FolderItem {
  id: string;
  title: string;
  slug: string;
  kind: FolderKind;
  coverUrl?: string | null;
  itemsCount?: number;
  isPublished?: boolean;
}

export interface SeoFormState {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  noindex: boolean;
}
