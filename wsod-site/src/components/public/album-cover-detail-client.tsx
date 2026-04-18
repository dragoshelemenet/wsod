"use client";

import { useState } from "react";

type Props = {
  title: string;
  frontSrc: string;
  backSrc?: string;
};

export function AlbumCoverDetailClient({ title, frontSrc, backSrc }: Props) {
  const [side, setSide] = useState<"front" | "back">("front");
  const activeSrc = side === "back" && backSrc ? backSrc : frontSrc;

  if (!frontSrc) return null;

  return (
    <div className="business-card-detail">
      {backSrc ? (
        <div className="detail-toggle-stack">
          <div className="business-card-toggle-wrap">
            <div
              className="business-card-toggle business-card-toggle-dynamic"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              <button
                type="button"
                className={`business-card-toggle-option ${side === "front" ? "is-active" : ""}`}
                onClick={() => setSide("front")}
              >
                Față
              </button>
              <button
                type="button"
                className={`business-card-toggle-option ${side === "back" ? "is-active" : ""}`}
                onClick={() => setSide("back")}
              >
                Spate
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="business-card-preview-wrap">
        <div className="business-card-preview-stage">
          <img
            src={activeSrc}
            alt={`${title} - ${side === "front" ? "Față" : "Spate"}`}
            className="business-card-preview-image"
          />
        </div>
      </div>
    </div>
  );
}
