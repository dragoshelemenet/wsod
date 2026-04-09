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

async function makeUniqueBlogSlug(baseSlug: string, excludeId: string) {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      mediaLinks: {
        include: {
          mediaItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json(
      { ok: false, message: "Articolul nu există." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, post });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Articolul nu există." },
      { status: 404 }
    );
  }

  const body = await request.json();

  const title = String(body.title || "").trim();
  const slugInput = String(body.slug || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  const contentHtml = String(body.contentHtml || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();
  const coverImageUrl = String(body.coverImageUrl || "").trim();
  const status = String(body.status || "draft").trim();
  const publishedAtRaw = String(body.publishedAt || "").trim();
  const mediaItemIds = Array.isArray(body.mediaItemIds)
    ? body.mediaItemIds.map((v: unknown) => String(v)).filter(Boolean)
    : [];

  if (!title) {
    return NextResponse.json(
      { ok: false, message: "Titlul articolului este obligatoriu." },
      { status: 400 }
    );
  }

  if (!contentHtml) {
    return NextResponse.json(
      { ok: false, message: "Conținutul articolului este obligatoriu." },
      { status: 400 }
    );
  }

  if (!["draft", "published"].includes(status)) {
    return NextResponse.json(
      { ok: false, message: "Status invalid." },
      { status: 400 }
    );
  }

  const slug = await makeUniqueBlogSlug(
    slugify(slugInput || title || existing.slug),
    id
  );

  const publishedAt =
    status === "published"
      ? publishedAtRaw
        ? new Date(publishedAtRaw)
        : existing.publishedAt || new Date()
      : null;

  if (publishedAt && Number.isNaN(publishedAt.getTime())) {
    return NextResponse.json(
      { ok: false, message: "Data publicării este invalidă." },
      { status: 400 }
    );
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      contentHtml,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      coverImageUrl: coverImageUrl || null,
      status,
      publishedAt,
      mediaLinks: {
        deleteMany: {},
        create: mediaItemIds.map((mediaItemId: string, index: number) => ({
          mediaItemId,
          sortOrder: index,
        })),
      },
    },
    include: {
      mediaLinks: {
        include: {
          mediaItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/studio-dashboard/blog");

  return NextResponse.json({
    ok: true,
    message: "Articol actualizat cu succes.",
    post,
  });
}
