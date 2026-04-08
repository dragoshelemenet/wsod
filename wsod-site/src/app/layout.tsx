import type { Metadata } from "next";
import "./globals.css";
import { createOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "WSOD.PROD — Agenție media digitală & video",
  description:
    "WSOD.PROD — video, foto, grafică, website-uri, audio și Meta Ads. Portofoliu media digitală în România.",
  metadataBase: new URL("https://example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WSOD.PROD — Agenție media digitală & video",
    description:
      "Portofoliu de video, foto, grafică, website-uri, audio și Meta Ads.",
    url: "https://example.com",
    siteName: "WSOD.PROD",
    locale: "ro_RO",
    type: "website",
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