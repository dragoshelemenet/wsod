import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSpacesClient, getSpacesConfig } from "@/lib/storage/spaces";
import { hasAdminSession } from "@/lib/auth/session";

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const isLoggedIn = await hasAdminSession();

    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const spacesClient = getSpacesClient();
    const spacesConfig = getSpacesConfig();

    if (!spacesClient) {
      return NextResponse.json(
        {
          error: "Spaces client missing config",
          debug: {
            hasEndpoint: !!process.env.DO_SPACES_ENDPOINT,
            hasRegion: !!process.env.DO_SPACES_REGION,
            hasKey: !!process.env.DO_SPACES_KEY,
            hasSecret: !!process.env.DO_SPACES_SECRET,
          },
        },
        { status: 500 }
      );
    }

    if (!spacesConfig) {
      return NextResponse.json(
        {
          error: "Spaces public config missing",
          debug: {
            hasBucket: !!process.env.DO_SPACES_BUCKET,
            hasRegion: !!process.env.DO_SPACES_REGION,
            hasCdnUrl: !!process.env.DO_SPACES_CDN_URL,
          },
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const fileName = String(body.fileName || "");
    const contentType = String(body.contentType || "application/octet-stream");
    const brandSlug = String(body.brandSlug || "general");
    const category = String(body.category || "uncategorized");

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileName);
    const objectKey = `uploads/${brandSlug}/${category}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: spacesConfig.bucket,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(spacesClient, command, {
      expiresIn: 60 * 5,
    });

    const publicUrl = `${spacesConfig.cdnUrl}/${objectKey}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      objectKey,
    });
  } catch (error) {
    console.error("PRESIGN_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        error: "Presign failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}