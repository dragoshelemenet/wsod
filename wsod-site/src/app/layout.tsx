import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WSOD.PROD — Agenție media digitală & video",
  description:
    "WSOD.PROD — video, foto, grafică, website-uri, audio și Meta Ads. Portofoliu media digitală în România.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}