import type { ReactNode } from "react";
import { PublicNavbar } from "@/components/public/public-navbar";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
