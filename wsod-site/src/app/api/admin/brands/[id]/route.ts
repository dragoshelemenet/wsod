import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const slug = normalizeSlug(String(body?.slug || ""));
    const logoUrl = String(body?.logoUrl || "").trim();
    const coverImageUrl = String(body?.coverImageUrl || "").trim();
    const description = String(body?.description || "").trim();
    const isVisible = Boolean(body?.isVisible);

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: "Id, name and slug are required." },
        { status: 400 }
      );
    }

    const conflict = await prisma.brand.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Slug already exists." },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        logoUrl: logoUrl || null,
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
    console.error("UPDATE_BRAND_ERROR", error);
    return NextResponse.json(
      { error: "Nu s-a putut actualiza brandul." },
      { status: 500 }
    );
  }
}
