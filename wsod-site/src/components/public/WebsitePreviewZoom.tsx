"use client";

import { useState } from "react";

type Props = {
  src: string;
  title: string;
};

export default function WebsitePreviewZoom({ src, title }: Props) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <div className="website-preview-shell">
      <div className="website-preview-toolbar">
        <button type="button" onClick={zoomOut}>-</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={zoomIn}>+</button>
        <button type="button" onClick={resetZoom}>Reset</button>
      </div>

      <div className="website-preview-viewport">
        <div
          className="website-preview-scale"
          style={{ transform: `scale(${zoom})` }}
        >
          <iframe
            src={src}
            title={title}
            className="website-detail-frame"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
