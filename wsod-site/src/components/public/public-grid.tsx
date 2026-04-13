import type { ReactNode } from "react";

type PublicGridProps = {
  children: ReactNode;
};

export function PublicGrid({ children }: PublicGridProps) {
  return <div className="public-grid">{children}</div>;
}
