import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const name = String(body.name || "").trim();
  const slug = slugify(String(body.slug || body.name || ""));
  const logoUrl = String(body.logoUrl || "").trim();
  const coverImageUrl = String(body.coverImageUrl || "").trim();
  const description = String(body.description || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele brandului este obligatoriu." },
      { status: 400 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "Slug invalid pentru brand." },
      { status: 400 }
    );
  }

  const existing = await prisma.brand.findUnique({
    where: { slug },
  });

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Brandul există deja." },
      { status: 409 }
    );
  }

  const brand = await prisma.brand.create({
    data: {
      name,
      slug,
      logoUrl: logoUrl || null,
      coverImageUrl: coverImageUrl || null,
      description: description || null,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
    },
  });

  revalidatePath("/studio-dashboard");
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/video");

  return NextResponse.json({
    ok: true,
    message: "Brand creat.",
    brand,
  });
}
