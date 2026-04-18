"use client";

import { useState } from "react";

type BusinessCardDetailClientProps = {
  previewSrc: string;
  frontSrc?: string;
  backSrc?: string;
  title: string;
};

export function BusinessCardDetailClient({
  previewSrc,
  frontSrc,
  backSrc,
  title,
}: BusinessCardDetailClientProps) {
  const hasFront = Boolean(frontSrc);
  const hasBack = Boolean(backSrc);
  const hasBoth = hasFront && hasBack;

  const [side, setSide] = useState<"front" | "back">(hasBack ? "back" : "front");

  const rawSrc = side === "front" ? frontSrc : backSrc;

  return (
    <div className="business-card-detail">
      <div className="business-card-preview-wrap">
        <img src={previewSrc} alt={title} className="business-card-preview-image" />
      </div>

      {hasBoth ? (
        <div className="business-card-toggle-wrap">
          <div className={`business-card-toggle business-card-toggle-3col ${side === "front" ? "is-right" : "is-left"}`}>
            <button
              type="button"
              className={`business-card-toggle-side ${side === "back" ? "is-active" : ""}`}
              onClick={() => setSide("back")}
            >
              Spate
            </button>

            <span className="business-card-toggle-center-label">Preview</span>

            <button
              type="button"
              className={`business-card-toggle-side ${side === "front" ? "is-active" : ""}`}
              onClick={() => setSide("front")}
            >
              Față
            </button>

            <div className="business-card-toggle-track">
              <span className="business-card-toggle-knob" />
            </div>
          </div>
        </div>
      ) : null}

      {rawSrc ? (
        <div className="business-card-raw-wrap">
          <div className="business-card-raw-frame">
            <img
              src={rawSrc}
              alt={side === "front" ? "Carte de vizită față" : "Carte de vizită spate"}
              className="business-card-raw-image"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
