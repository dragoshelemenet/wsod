"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function createBrandAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

  if (!name || !slug) return;

  const existing = await prisma.brand.findUnique({
    where: { slug },
  });

  if (existing) return;

  await prisma.brand.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
}

export async function updateBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

  if (!id || !name || !slug) return;

  const conflict = await prisma.brand.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (conflict) return;

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
}

export async function deleteBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");

  if (!id) return;

  await prisma.brand.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
}

export async function createMediaAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const brandSlug = String(formData.get("brandSlug") || "").trim();

  if (!title || !category || !type || !date || !brandSlug) return;

  const brand = await prisma.brand.findUnique({
    where: { slug: brandSlug },
  });

  if (!brand) return;

  await prisma.mediaItem.create({
    data: {
      title,
      description: description || null,
      category,
      type,
      date: new Date(date),
      fileUrl: fileUrl || null,
      thumbnail: thumbnail || null,
      brandId: brand.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  revalidatePath("/video");
  revalidatePath("/foto");
  revalidatePath("/grafica");
  revalidatePath("/audio");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath(`/brand/${brand.slug}`);
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");

  if (!id) return;

  await prisma.mediaItem.delete({
    where: { id },
  });

  revalidatePath("/video");
  revalidatePath("/foto");
  revalidatePath("/grafica");
  revalidatePath("/audio");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/studio-dashboard");
}
