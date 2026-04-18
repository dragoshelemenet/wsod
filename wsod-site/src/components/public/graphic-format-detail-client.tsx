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
  const available = useMemo(() => {
    const list: Array<{ key: FormatKey; src: string }> = [];

    const pushIf = (key: FormatKey, src?: string) => {
      if (src && src.trim()) {
        list.push({ key, src });
      }
    };

    if (displayFormatMain === "16:9") pushIf("16:9", mainSrc);
    if (displayFormatMain === "9:16") pushIf("9:16", mainSrc);
    if (displayFormatMain === "1:1") pushIf("1:1", mainSrc);

    if (displayFormatMain !== "16:9") pushIf("16:9", format16x9Url);
    if (displayFormatMain !== "9:16") pushIf("9:16", format9x16Url);
    if (displayFormatMain !== "1:1") pushIf("1:1", format1x1Url);

    if (!list.length && mainSrc) {
      list.push({ key: "16:9", src: mainSrc });
    }

    return list;
  }, [displayFormatMain, mainSrc, format16x9Url, format9x16Url, format1x1Url]);

  const [activeFormat, setActiveFormat] = useState<FormatKey>(available[0]?.key || "16:9");
  const activeItem = available.find((item) => item.key === activeFormat) || available[0];

  if (!activeItem?.src) return null;

  return (
    <div className="business-card-detail">
      {available.length > 1 ? (
        <div className="detail-toggle-stack">
          <div className="business-card-toggle-wrap">
            <div
              className="business-card-toggle business-card-toggle-dynamic"
              style={{ gridTemplateColumns: `repeat(${available.length}, minmax(0, 1fr))` }}
            >
              {available.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`business-card-toggle-option ${activeFormat === item.key ? "is-active" : ""}`}
                  onClick={() => setActiveFormat(item.key)}
                >
                  {item.key}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="business-card-preview-wrap">
        <div className="business-card-preview-stage">
          <img
            src={activeItem.src}
            alt={`${title} - ${activeItem.key}`}
            className="business-card-preview-image"
          />
        </div>
      </div>
    </div>
  );
}
