import type { ReactNode } from "react";

type FileGridProps = {
  children: ReactNode;
  dense?: boolean;
};

export function FileGrid({ children, dense = false }: FileGridProps) {
  return (
    <div className={dense ? "media-file-grid image-only-grid" : "media-file-grid"}>
      {children}
    </div>
  );
}
