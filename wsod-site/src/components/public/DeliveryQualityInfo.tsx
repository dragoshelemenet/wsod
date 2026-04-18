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
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current) return;
      const target = event.target as Node | null;
      if (target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`delivery-quality-note ${className}`.trim()}>
      <button
        type="button"
        className={`delivery-quality-note-trigger ${open ? "is-open" : ""}`}
        aria-label="Informații despre calitatea materialelor"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="delivery-quality-note-trigger-icon">i</span>
        <span className="delivery-quality-note-trigger-text">Calitate website</span>
      </button>

      <div className={`delivery-quality-note-tooltip ${open ? "is-open" : ""}`}>
        {MESSAGE}
      </div>
    </div>
  );
}
