"use client";

import { useState } from "react";

type Props = {
  src: string;
  title: string;
};

export default function WebsitePreviewZoom({ src, title }: Props) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.6));
  const resetZoom = () => setZoom(1);

  return (
    <div className="website-preview-shell">
      <div className="website-preview-toolbar">
        <button
          type="button"
          className="website-preview-zoom-btn"
          onClick={zoomOut}
        >
          -
        </button>
        <button
          type="button"
          className="website-preview-zoom-btn"
          onClick={resetZoom}
        >
          100%
        </button>
        <button
          type="button"
          className="website-preview-zoom-btn"
          onClick={zoomIn}
        >
          +
        </button>
      </div>

      <div className="website-detail-square-wrap">
        <div className="website-detail-square">
          <div
            className="website-preview-zoom-stage"
            style={{ overflow: "auto" }}
          >
            <img
              src={src}
              alt={title}
              className="website-preview-zoom-image"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
