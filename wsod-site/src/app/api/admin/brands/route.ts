import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const slug = normalizeSlug(String(body?.slug || ""));
    const coverImageUrl = String(body?.coverImageUrl || "").trim();
    const description = String(body?.description || "").trim();
    const isVisible = Boolean(body?.isVisible);

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists." },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        coverImageUrl: coverImageUrl || null,
        description: description || null,
        isVisible,
      },
    });

    revalidatePath("/");
    revalidatePath("/brand");
    revalidatePath("/foto");
    revalidatePath("/video");
    revalidatePath("/grafica");
    revalidatePath("/website");
    revalidatePath("/studio-dashboard");
    revalidatePath("/studio-dashboard/brands");

    return NextResponse.json({ ok: true, brand });
  } catch (error) {
    console.error("CREATE_BRAND_ERROR", error);
    return NextResponse.json(
      { error: "Nu s-a putut crea brandul." },
      { status: 500 }
    );
  }
}
