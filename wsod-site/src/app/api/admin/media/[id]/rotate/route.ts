import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { uploadBufferToSpaces } from "@/lib/media/spaces-server";

type Ctx = {
  params: Promise<{ id: string }>;
};

function normalizeRotation(value: number) {
  const normalized = ((value % 360) + 360) % 360;
  return normalized === 90 || normalized === 180 || normalized === 270 ? normalized : 0;
}

function isImageUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".avif"].some((ext) => clean.endsWith(ext));
}

function extFromUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "png";
  if (clean.endsWith(".webp")) return "webp";
  if (clean.endsWith(".avif")) return "avif";
  return "jpeg";
}

function mimeFromFormat(format: string) {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  if (format === "avif") return "image/avif";
  return "image/jpeg";
}

async function rotateOne(url: string, degrees: number, keyBase: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nu s-a putut descărca fișierul: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const input = Buffer.from(arrayBuffer);
  const format = extFromUrl(url);
  let pipeline = sharp(input).rotate(degrees);

  let output: Buffer;
  if (format === "png") {
    output = await pipeline.png().toBuffer();
  } else if (format === "webp") {
    output = await pipeline.webp({ quality: 92 }).toBuffer();
  } else if (format === "avif") {
    output = await pipeline.avif({ quality: 88 }).toBuffer();
  } else {
    output = await pipeline.jpeg({ quality: 92 }).toBuffer();
  }

  const key = `${keyBase}.${format}`;
  const publicUrl = await uploadBufferToSpaces({
    key,
    body: output,
    contentType: mimeFromFormat(format),
  });

  return publicUrl;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const direction = body?.direction === "left" ? "left" : "right";
    const degrees = direction === "left" ? -90 : 90;

    const item = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ ok: false, message: "Media item nu există." }, { status: 404 });
    }

    if (item.category === "video" || item.type === "video") {
      return NextResponse.json(
        { ok: false, message: "Rotirea fizică este disponibilă doar pentru imagini." },
        { status: 400 }
      );
    }

    const targetUrl = item.fileUrl || item.previewUrl || item.thumbnailUrl;
    if (!targetUrl || !isImageUrl(targetUrl)) {
      return NextResponse.json(
        { ok: false, message: "Fișierul nu pare a fi o imagine suportată." },
        { status: 400 }
      );
    }

    const stamp = Date.now();
    const base = `uploads/wsod-prod/${item.category}/rotated/${item.slug || item.id}-${stamp}`;

    const [nextFileUrl, nextPreviewUrl, nextThumbnailUrl] = await Promise.all([
      item.fileUrl && isImageUrl(item.fileUrl)
        ? rotateOne(item.fileUrl, degrees, `${base}-file`)
        : Promise.resolve(item.fileUrl),
      item.previewUrl && isImageUrl(item.previewUrl)
        ? rotateOne(item.previewUrl, degrees, `${base}-preview`)
        : Promise.resolve(item.previewUrl),
      item.thumbnailUrl && isImageUrl(item.thumbnailUrl)
        ? rotateOne(item.thumbnailUrl, degrees, `${base}-thumb`)
        : Promise.resolve(item.thumbnailUrl),
    ]);

    const updated = await prisma.mediaItem.update({
      where: { id: item.id },
      data: {
        fileUrl: nextFileUrl,
        previewUrl: nextPreviewUrl,
        thumbnailUrl: nextThumbnailUrl,
        rotation: 0,
      },
      include: {
        brand: true,
        personModel: true,
        audioProfile: true,
      },
    });

    return NextResponse.json({
      ok: true,
      mediaItem: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Eroare la rotire.",
      },
      { status: 500 }
    );
  }
}
