import type { ReactNode } from "react";
import { PublicNavbar } from "@/components/public/public-navbar";
import { PublicFooter } from "@/components/public/public-footer";
import { getSiteContentRecord } from "@/lib/dashboard/queries";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const siteContent = await getSiteContentRecord();

  return (
    <>
      <PublicNavbar logoUrl={siteContent?.homeLogoUrl ?? null} />
      {children}
      <PublicFooter />
    </>
  );
}
