import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function makeUniqueSlug(baseSlug: string, excludeId?: string) {
  const cleanBase = slugify(baseSlug) || "media-item";
  let slug = cleanBase;
  let counter = 1;

  while (true) {
    const existing = await prisma.mediaItem.findFirst({
      where: excludeId
        ? {
            slug,
            NOT: { id: excludeId },
          }
        : { slug },
      select: { id: true },
    });

    if (!existing) return slug;

    slug = `${cleanBase}-${counter}`;
    counter += 1;
  }
}

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const ownerType = String(body.ownerType || "").trim();
    const brandSlug = String(body.brandSlug || "").trim();
    const personModelSlug = String(body.personModelSlug || "").trim();
    const audioProfileSlug = String(body.audioProfileSlug || "").trim();

    const category = String(body.category || "").trim();
    const type = String(body.type || "").trim();
    const title = String(body.title || "").trim();
    const manualSlug = String(body.slug || "").trim();
    const description = String(body.description || "").trim();
    const seoTitle = String(body.seoTitle || "").trim();
    const metaDescription = String(body.metaDescription || "").trim();
    const dateRaw = String(body.date || "").trim();

    const fileUrl = String(body.fileUrl || "").trim();
    const thumbnailUrl = String(body.thumbnailUrl || "").trim();
    const previewUrl = String(body.previewUrl || "").trim();
    const fileNameOriginal = String(body.fileNameOriginal || "").trim();

    const groupLabel = String(body.groupLabel || "").trim();
    const graphicKind = String(body.graphicKind || "").trim();
    const groupOrder = Number(body.groupOrder ?? 0);

    const isVisible =
      typeof body.isVisible === "boolean" ? body.isVisible : true;
    const isFeatured =
      typeof body.isFeatured === "boolean" ? body.isFeatured : false;
    const aiEdited =
      typeof body.aiEdited === "boolean" ? body.aiEdited : false;
    const aiEdited =
      typeof body.aiEdited === "boolean" ? body.aiEdited : false;

    if (!category) {
      return NextResponse.json(
        { ok: false, message: "Categoria este obligatorie." },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { ok: false, message: "Tipul media este obligatoriu." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, message: "Titlul este obligatoriu." },
        { status: 400 }
      );
    }

    if (!dateRaw) {
      return NextResponse.json(
        { ok: false, message: "Data este obligatorie." },
        { status: 400 }
      );
    }

    if (!fileUrl) {
      return NextResponse.json(
        { ok: false, message: "Fișierul principal nu a fost salvat corect." },
        { status: 400 }
      );
    }

    let brandId: string | null = null;
    let personModelId: string | null = null;
    let audioProfileId: string | null = null;

    if (ownerType) {
      if (!["brand", "model", "audioProfile"].includes(ownerType)) {
        return NextResponse.json(
          { ok: false, message: "Tipul de asociere este invalid." },
          { status: 400 }
        );
      }

      if (ownerType === "brand") {
        if (!brandSlug) {
          return NextResponse.json(
            { ok: false, message: "Selectează un brand." },
            { status: 400 }
          );
        }

        const brand = await prisma.brand.findUnique({
          where: { slug: brandSlug },
          select: { id: true },
        });

        if (!brand) {
          return NextResponse.json(
            { ok: false, message: "Brandul selectat nu există." },
            { status: 404 }
          );
        }

        brandId = brand.id;
      }

      if (ownerType === "model") {
        if (!personModelSlug) {
          return NextResponse.json(
            { ok: false, message: "Selectează un model." },
            { status: 400 }
          );
        }

        const model = await prisma.personModel.findUnique({
          where: { slug: personModelSlug },
          select: { id: true },
        });

        if (!model) {
          return NextResponse.json(
            { ok: false, message: "Modelul selectat nu există." },
            { status: 404 }
          );
        }

        personModelId = model.id;
      }

      if (ownerType === "audioProfile") {
        if (!audioProfileSlug) {
          return NextResponse.json(
            { ok: false, message: "Selectează un profil audio." },
            { status: 400 }
          );
        }

        const profile = await prisma.audioProfile.findUnique({
          where: { slug: audioProfileSlug },
          select: { id: true },
        });

        if (!profile) {
          return NextResponse.json(
            { ok: false, message: "Profilul audio selectat nu există." },
            { status: 404 }
          );
        }

        audioProfileId = profile.id;
      }
    }

    if (category === "foto" && ownerType === "model" && !groupLabel) {
      return NextResponse.json(
        { ok: false, message: "Selectează tipul outfitului." },
        { status: 400 }
      );
    }

    if (category === "grafica" && ownerType && !graphicKind) {
      return NextResponse.json(
        { ok: false, message: "Selectează tipul materialului grafic." },
        { status: 400 }
      );
    }

    const baseSlug = manualSlug || title || fileNameOriginal || "media-item";
    const slug = await makeUniqueSlug(baseSlug);

    const parsedDate = new Date(dateRaw);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { ok: false, message: "Data este invalidă." },
        { status: 400 }
      );
    }

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        slug,
        category,
        type,
        date: parsedDate,
        fileUrl,
        thumbnailUrl: thumbnailUrl || null,
        previewUrl: previewUrl || null,
        fileNameOriginal: fileNameOriginal || null,
        description: description || null,
        seoTitle: seoTitle || null,
        metaDescription: metaDescription || null,
        groupLabel:
          category === "foto" && ownerType === "model" ? groupLabel || null : null,
        groupOrder:
          category === "foto" && ownerType === "model"
            ? Number.isFinite(groupOrder)
              ? groupOrder
              : 0
            : 0,
        graphicKind: category === "grafica" ? graphicKind || null : null,
        aiEdited,
        isVisible,
        isFeatured,
        brandId,
        personModelId,
        audioProfileId,
      },
    });

    revalidatePath("/");
    revalidatePath("/foto");
    revalidatePath("/video");
    revalidatePath("/grafica");
    revalidatePath("/website");
    revalidatePath("/meta-ads");
    revalidatePath("/audio");
    revalidatePath("/studio-dashboard");
    revalidatePath("/studio-dashboard/upload");

    if (brandSlug) revalidatePath(`/brand/${brandSlug}`);
    if (personModelSlug) revalidatePath(`/model/${personModelSlug}`);
    if (audioProfileSlug) revalidatePath(`/audio-profile/${audioProfileSlug}`);

    return NextResponse.json({
      ok: true,
      message: "Media salvată cu succes.",
      mediaItem,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Nu s-a putut crea media item.",
      },
      { status: 500 }
    );
  }
}
