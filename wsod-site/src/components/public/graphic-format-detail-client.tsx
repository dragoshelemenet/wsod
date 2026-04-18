"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  mainSrc: string;
  displayFormatMain?: string;
  format16x9Url?: string;
  format9x16Url?: string;
  format1x1Url?: string;
};

type FormatKey = "16:9" | "9:16" | "1:1";

export function GraphicFormatDetailClient({
  title,
  mainSrc,
  displayFormatMain,
  format16x9Url,
  format9x16Url,
  format1x1Url,
}: Props) {
  const formats = useMemo(() => {
    const map: Record<FormatKey, string> = {
      "16:9": format16x9Url || "",
      "9:16": format9x16Url || "",
      "1:1": format1x1Url || "",
    };

    if (
      displayFormatMain &&
      mainSrc &&
      (displayFormatMain === "16:9" ||
        displayFormatMain === "9:16" ||
        displayFormatMain === "1:1")
    ) {
      map[displayFormatMain as FormatKey] = mainSrc;
    }

    return map;
  }, [displayFormatMain, mainSrc, format16x9Url, format9x16Url, format1x1Url]);

  const available = (["16:9", "9:16", "1:1"] as FormatKey[]).filter((key) => !!formats[key]);
  const [activeFormat, setActiveFormat] = useState<FormatKey>((available[0] || "16:9") as FormatKey);

  const activeSrc = formats[activeFormat] || mainSrc;

  if (!activeSrc) return null;

  return (
    <div className="business-card-detail">
      {available.length > 1 ? (
        <div className="detail-toggle-stack">
          <div className="business-card-toggle-wrap">
            <div className="business-card-toggle business-card-toggle-3way">
              {available.map((format) => (
                <button
                  key={format}
                  type="button"
                  className={`business-card-toggle-option ${activeFormat === format ? "is-active" : ""}`}
                  onClick={() => setActiveFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="business-card-preview-wrap">
        <div className="business-card-preview-stage">
          <img
            src={activeSrc}
            alt={`${title} - ${activeFormat}`}
            className="business-card-preview-image"
          />
        </div>
      </div>
    </div>
  );
}
