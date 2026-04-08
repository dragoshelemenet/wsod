"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function createBrandAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

  if (!name || !slug) {
    return { ok: false, message: "Numele și slug-ul sunt obligatorii." };
  }

  const existing = await prisma.brand.findUnique({
    where: { slug },
  });

  if (existing) {
    return { ok: false, message: "Există deja un brand cu acest slug." };
  }

  await prisma.brand.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  return { ok: true, message: "Brand creat." };
}

export async function updateBrandAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

  if (!id || !name || !slug) {
    return { ok: false, message: "Date incomplete." };
  }

  const conflict = await prisma.brand.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (conflict) {
    return { ok: false, message: "Slug deja folosit de alt brand." };
  }

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  return { ok: true, message: "Brand actualizat." };
}

export async function deleteBrandAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    return { ok: false, message: "ID lipsă." };
  }

  await prisma.brand.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  return { ok: true, message: "Brand șters." };
}

export async function deleteMediaAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    return { ok: false, message: "ID lipsă." };
  }

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

  return { ok: true, message: "Fișier șters." };
}