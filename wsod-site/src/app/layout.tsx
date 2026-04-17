import type { Metadata } from "next";
import "./globals.css";
import "./ui-cleanup.css";
import { createOrganizationSchema } from "@/lib/seo/schema";
import AntiDownloadGuard from "@/components/anti-download-guard";
import PageRevealEffect from "@/components/page-reveal-effect";

export const metadata: Metadata = {
  title: "WSOD.PROD — Agenție media digitală în România | Video, foto, grafică, website-uri",
  description:
    "WSOD.PROD este o agenție media digitală din România care oferă producție video, fotografie, grafică, website-uri, audio și Meta Ads pentru branduri și business-uri.",
  metadataBase: new URL("https://wsod.cloud"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WSOD.PROD — Agenție media digitală în România",
    description:
      "Producție video, fotografie, grafică, website-uri, audio și Meta Ads pentru branduri și business-uri.",
    url: "https://wsod.cloud",
    siteName: "WSOD.PROD",
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WSOD.PROD — Agenție media digitală în România",
    description:
      "Producție video, fotografie, grafică, website-uri, audio și Meta Ads pentru branduri și business-uri.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = createOrganizationSchema();

  return (
    <html lang="ro">
      <body>
        <AntiDownloadGuard />
        <PageRevealEffect />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
