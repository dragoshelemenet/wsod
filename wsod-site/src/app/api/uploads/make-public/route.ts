import { NextResponse } from "next/server";
import { PutObjectAclCommand } from "@aws-sdk/client-s3";
import { getSpacesClient, getSpacesConfig } from "@/lib/storage/spaces";
import { hasAdminSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const isLoggedIn = await hasAdminSession();

    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const spacesClient = getSpacesClient();
    const spacesConfig = getSpacesConfig();

    if (!spacesClient || !spacesConfig) {
      return NextResponse.json(
        { error: "Spaces config missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const objectKey = String(body.objectKey || "");

    if (!objectKey) {
      return NextResponse.json({ error: "Missing objectKey" }, { status: 400 });
    }

    await spacesClient.send(
      new PutObjectAclCommand({
        Bucket: spacesConfig.bucket,
        Key: objectKey,
        ACL: "public-read",
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MAKE_PUBLIC_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        error: "Make public failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}