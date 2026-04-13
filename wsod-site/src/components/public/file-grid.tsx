import type { ReactNode } from "react";

type FileGridProps = {
  children: ReactNode;
};

export function FileGrid({ children }: FileGridProps) {
  return <div className="media-file-grid">{children}</div>;
}
