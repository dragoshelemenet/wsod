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

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele modelului este obligatoriu." },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  const existing = await prisma.personModel.findUnique({
    where: { slug },
  });

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Modelul există deja." },
      { status: 409 }
    );
  }

  const personModel = await prisma.personModel.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/studio-dashboard");
  revalidatePath("/foto");

  return NextResponse.json({
    ok: true,
    message: "Model creat.",
    personModel,
  });
}