import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const kindRaw = String(body?.kind || "").trim().toLowerCase();
    const kind = kindRaw === "artist" ? "artist" : "influencer";

    const item = await prisma.talentProfile.update({
      where: { id },
      data: {
        name,
        slug: slugify(String(body?.slug || "").trim() || name),
        kind,
        portraitImageUrl: body?.portraitImageUrl || null,
        coverImageUrl: body?.coverImageUrl || null,
        hoverPreview1: body?.hoverPreview1 || null,
        hoverPreview2: body?.hoverPreview2 || null,
        hoverPreview3: body?.hoverPreview3 || null,
        description: body?.description || null,
        seoTitle: body?.seoTitle || null,
        metaDescription: body?.metaDescription || null,
        isVisible: Boolean(body?.isVisible),
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nu am putut salva profilul." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.talentProfile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nu am putut șterge profilul." },
      { status: 500 }
    );
  }
}
