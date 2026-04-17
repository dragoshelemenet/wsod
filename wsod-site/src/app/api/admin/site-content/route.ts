import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const id = body?.id || "main";

    const saved = await prisma.siteContent.upsert({
      where: { id },
      update: {
        homeLogoUrl: body?.homeLogoUrl || null,
        servicesEyebrow: body?.servicesEyebrow || null,
        servicesTitle: body?.servicesTitle || null,
        servicesList: body?.servicesList || null,
        servicesCards: body?.servicesCards || null,
        packageCards: body?.packageCards || null,
        servicesTableRows: body?.servicesTableRows || null,
        servicesCertificatesTitle: body?.servicesCertificatesTitle || null,
        pricingLabel: body?.pricingLabel || null,
        pricingHref: body?.pricingHref || null,
        contactLabel: body?.contactLabel || null,
        contactHref: body?.contactHref || null,
        claimLabel: body?.claimLabel || null,
        claimHref: body?.claimHref || null,
      },
      create: {
        id,
        homeLogoUrl: body?.homeLogoUrl || null,
        servicesEyebrow: body?.servicesEyebrow || null,
        servicesTitle: body?.servicesTitle || null,
        servicesList: body?.servicesList || null,
        servicesCards: body?.servicesCards || null,
        packageCards: body?.packageCards || null,
        servicesTableRows: body?.servicesTableRows || null,
        servicesCertificatesTitle: body?.servicesCertificatesTitle || null,
        pricingLabel: body?.pricingLabel || null,
        pricingHref: body?.pricingHref || null,
        contactLabel: body?.contactLabel || null,
        contactHref: body?.contactHref || null,
        claimLabel: body?.claimLabel || null,
        claimHref: body?.claimHref || null,
      },
    });

    return NextResponse.json({ ok: true, item: saved });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
