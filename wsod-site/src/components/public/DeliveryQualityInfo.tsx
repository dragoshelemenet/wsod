"use client";

import { useEffect, useRef, useState } from "react";

type DeliveryQualityInfoProps = {
  className?: string;
};

const MESSAGE =
  "Materialele finale au fost livrate clientului în format mare, la calitate înaltă. Pe website sunt afișate variante optimizate, pentru o încărcare mai rapidă.";

export function DeliveryQualityInfo({ className = "" }: DeliveryQualityInfoProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`delivery-quality-note ${className}`.trim()}
    >
      <button
        type="button"
        className="delivery-quality-note-trigger"
        aria-label="Informații despre calitatea materialelor"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>

      <div className={`delivery-quality-note-tooltip ${open ? "is-open" : ""}`}>
        {MESSAGE}
      </div>
    </div>
  );
}
