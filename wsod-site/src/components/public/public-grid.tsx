import type { ReactNode } from "react";

type PublicGridProps = {
  children: ReactNode;
  dense?: boolean;
};

export function PublicGrid({ children, dense = false }: PublicGridProps) {
  return (
    <div className={dense ? "public-grid image-only-grid" : "public-grid"}>
      {children}
    </div>
  );
}
