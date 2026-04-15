"use client";

import { useMemo, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export default function ZoomableWebsitePreview({ src, alt }: Props) {
  const [zoom, setZoom] = useState(1);

  const widthPercent = useMemo(() => `${100 / zoom}%`, [zoom]);

  return (
    <section className="website-preview-shell">
      <div className="website-preview-toolbar">
        <button
          type="button"
          className="website-preview-btn"
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
        >
          -
        </button>

        <span className="website-preview-zoom-label">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          className="website-preview-btn"
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
        >
          +
        </button>

        <button
          type="button"
          className="website-preview-btn"
          onClick={() => setZoom(1)}
        >
          Reset
        </button>
      </div>

      <div className="website-preview-frame">
        <div className="website-preview-canvas">
          <img
            src={src}
            alt={alt}
            className="website-preview-image"
            style={{
              width: widthPercent,
              transform: `scale(${zoom})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
