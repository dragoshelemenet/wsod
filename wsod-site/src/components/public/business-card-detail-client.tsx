"use client";

import { useMemo, useState } from "react";

type BusinessCardDetailClientProps = {
  previewSrc: string;
  frontSrc?: string;
  backSrc?: string;
  title: string;
};

type ViewMode = "back" | "preview" | "front";

export function BusinessCardDetailClient({
  previewSrc,
  frontSrc,
  backSrc,
  title,
}: BusinessCardDetailClientProps) {
  const hasFront = Boolean(frontSrc);
  const hasBack = Boolean(backSrc);
  const hasPreview = Boolean(previewSrc);

  const modes = useMemo(() => {
    const result: Array<{ key: ViewMode; label: string; src?: string }> = [];
    if (hasBack) result.push({ key: "back", label: "Spate", src: backSrc });
    if (hasPreview) result.push({ key: "preview", label: "Împreună", src: previewSrc });
    if (hasFront) result.push({ key: "front", label: "Față", src: frontSrc });
    return result;
  }, [hasBack, hasPreview, hasFront, backSrc, previewSrc, frontSrc]);

  const defaultMode: ViewMode =
    hasPreview ? "preview" : hasBack ? "back" : "front";

  const [mode, setMode] = useState<ViewMode>(defaultMode);

  const active = modes.find((item) => item.key === mode) ?? modes[0];
  const activeSrc = active?.src || previewSrc || frontSrc || backSrc || "";

  if (!activeSrc) return null;

  return (
    <div className="business-card-detail">
      {modes.length >= 2 ? (
        <div className="detail-toggle-stack">
          <div className="business-card-toggle-wrap">
            <div
              className={`business-card-toggle business-card-toggle-3way ${
                mode === "back"
                  ? "is-left"
                  : mode === "front"
                  ? "is-right"
                  : "is-center"
              }`}
            >
              {modes.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`business-card-toggle-option ${
                    mode === item.key ? "is-active" : ""
                  }`}
                  onClick={() => setMode(item.key)}
                >
                  {item.label}
                </button>
              ))}
              <span className="business-card-toggle-knob" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="business-card-preview-wrap">
        <div className="business-card-preview-stage">
          <img
            src={activeSrc}
            alt={`${title} - ${active?.label || "Preview"}`}
            className="business-card-preview-image"
          />
        </div>
      </div>
    </div>
  );
}
