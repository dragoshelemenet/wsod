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

    const ownerTypeRaw = String(body.ownerType || "").trim().toLowerCase();
    const ownerType =
      ownerTypeRaw === "model" ||
      ownerTypeRaw === "artist" ||
      ownerTypeRaw === "influencer"
        ? ownerTypeRaw
        : "brand";

    const brandSlug = String(body.brandSlug || "").trim();
    const modelSlug = String(body.modelSlug || "").trim();
    const talentSlug = String(body.talentSlug || "").trim();

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
    const beforeAiUrl = String(body.beforeAiUrl || "").trim();
    const cardFrontUrl = String(body.cardFrontUrl || "").trim();
    const cardBackUrl = String(body.cardBackUrl || "").trim();
    const albumBackUrl = String(body.albumBackUrl || "").trim();
    const displayFormatMainRaw = String(body.displayFormatMain || "").trim();
    const displayFormatMain = ["16:9", "9:16", "1:1"].includes(displayFormatMainRaw) ? displayFormatMainRaw : null;
    const format16x9Url = String(body.format16x9Url || "").trim();
    const format9x16Url = String(body.format9x16Url || "").trim();
    const format1x1Url = String(body.format1x1Url || "").trim();
    const fileNameOriginal = String(body.fileNameOriginal || "").trim();

    const groupLabel = String(body.groupLabel || "").trim();
    const graphicKind = String(body.graphicKind || "").trim();
    const videoKindRaw = String(body.videoKind || "").trim();
    const videoKind = videoKindRaw === "lyrics" ? "lyrics" : null;
    const videoFormatRaw = String(body.videoFormat || "").trim();
    const videoFormat = ["portrait-9x16", "wide-16x9", "square-1x1"].includes(videoFormatRaw)
      ? videoFormatRaw
      : "portrait-9x16";
    const groupOrder = Number(body.groupOrder ?? 0);

    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : true;
    const isFeatured = typeof body.isFeatured === "boolean" ? body.isFeatured : false;

    const aiModeRaw = String(body.aiMode || "").trim();
    const aiMode =
      aiModeRaw === "ai" ||
      aiModeRaw === "ai-edit" ||
      aiModeRaw === "ai-enhanced"
        ? aiModeRaw
        : null;
    const aiEdited =
      typeof body.aiEdited === "boolean" ? body.aiEdited : Boolean(aiMode);

    const showOnServices =
      typeof body.showOnServices === "boolean" ? body.showOnServices : false;

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

    if (category === "foto" && aiMode && !beforeAiUrl) {
      return NextResponse.json(
        { ok: false, message: "Pentru pozele cu AI trebuie să încarci și imaginea before AI." },
        { status: 400 }
      );
    }

    if (category === "grafica" && graphicKind === "carte-vizita" && (!cardFrontUrl || !cardBackUrl)) {
      return NextResponse.json(
        { ok: false, message: "Pentru cartea de vizită trebuie să încarci atât Față cât și Spate." },
        { status: 400 }
      );
    }

    let brandId: string | null = null;
    let personModelId: string | null = null;
    let talentProfileId: string | null = null;

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
      if (!modelSlug) {
        return NextResponse.json(
          { ok: false, message: "Selectează un model." },
          { status: 400 }
        );
      }

      const model = await prisma.personModel.findUnique({
        where: { slug: modelSlug },
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

    if (ownerType === "artist" || ownerType === "influencer") {
      if (!talentSlug) {
        return NextResponse.json(
          { ok: false, message: "Selectează profilul." },
          { status: 400 }
        );
      }

      const talent = await prisma.talentProfile.findUnique({
        where: { slug: talentSlug },
        select: { id: true, kind: true },
      });

      if (!talent) {
        return NextResponse.json(
          { ok: false, message: "Profilul selectat nu există." },
          { status: 404 }
        );
      }

      if (talent.kind !== ownerType) {
        return NextResponse.json(
          { ok: false, message: "Tipul profilului nu corespunde." },
          { status: 400 }
        );
      }

      talentProfileId = talent.id;
    }

    if (category === "foto" && ownerType === "model" && !groupLabel) {
      return NextResponse.json(
        { ok: false, message: "Selectează tipul outfitului." },
        { status: 400 }
      );
    }

    if (category === "grafica" && !graphicKind) {
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
        beforeAiUrl: beforeAiUrl || null,
        cardFrontUrl: cardFrontUrl || null,
        cardBackUrl: cardBackUrl || null,
        albumBackUrl: albumBackUrl || null,
        displayFormatMain: displayFormatMain || null,
        format16x9Url: format16x9Url || null,
        format9x16Url: format9x16Url || null,
        format1x1Url: format1x1Url || null,
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
        showOnServices: category === "grafica" ? showOnServices : false,
        videoKind: category === "video" ? videoKind : null,
        videoFormat: category === "video" ? videoFormat : null,
        aiEdited,
        aiMode,
        isVisible,
        isFeatured,
        brandId,
        personModelId,
        talentProfileId,
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
    revalidatePath("/studio-dashboard/media");
    revalidatePath("/studio-dashboard/talents");

    if (brandSlug) revalidatePath(`/brand/${brandSlug}`);
    if (modelSlug) revalidatePath(`/model/${modelSlug}`);
    if (talentSlug) {
      revalidatePath(`/artist/${talentSlug}`);
      revalidatePath(`/influencer/${talentSlug}`);
    }

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
