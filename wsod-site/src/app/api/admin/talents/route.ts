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

export async function GET() {
  try {
    const items = await prisma.talentProfile.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        mediaItems: {
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nu am putut încărca profilele." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const kindRaw = String(body?.kind || "").trim().toLowerCase();
    const kind = kindRaw === "artist" ? "artist" : "influencer";

    if (!name) {
      return NextResponse.json({ error: "Numele este obligatoriu." }, { status: 400 });
    }

    const baseSlug = slugify(String(body?.slug || "").trim() || name);

    const item = await prisma.talentProfile.create({
      data: {
        name,
        slug: baseSlug,
        kind,
        portraitImageUrl: body?.portraitImageUrl || null,
        coverImageUrl: body?.coverImageUrl || null,
        hoverPreview1: body?.hoverPreview1 || null,
        hoverPreview2: body?.hoverPreview2 || null,
        hoverPreview3: body?.hoverPreview3 || null,
        description: body?.description || null,
        seoTitle: body?.seoTitle || null,
        metaDescription: body?.metaDescription || null,
        isVisible: typeof body?.isVisible === "boolean" ? body.isVisible : true,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nu am putut crea profilul." },
      { status: 500 }
    );
  }
}
