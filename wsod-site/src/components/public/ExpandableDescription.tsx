"use client";

import { useState } from "react";

type Props = {
  text?: string | null;
  className?: string;
  collapsedLines?: number;
};

export function ExpandableDescription({
  text,
  className = "",
  collapsedLines = 3,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!text || !text.trim()) return null;

  return (
    <div className={`expandable-description ${className}`.trim()}>
      <div
        className={`expandable-description-text ${open ? "is-open" : "is-collapsed"}`}
        style={
          open
            ? undefined
            : {
                WebkitLineClamp: String(collapsedLines),
              }
        }
      >
        {text}
      </div>

      {!open ? <div className="expandable-description-fade" aria-hidden="true" /> : null}

      <button
        type="button"
        className="expandable-description-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{open ? "Mai puțin" : "Citește mai mult"}</span>
        <span className={`expandable-description-arrow ${open ? "is-open" : ""}`}>
          {open ? "↑" : "↓"}
        </span>
      </button>
    </div>
  );
}
