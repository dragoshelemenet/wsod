"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const REVEAL_MS = 1500;

export default function PageRevealEffect() {
  const pathname = usePathname();
  const firstRunRef = useRef(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const body = document.body;

    const run = () => {
      body.classList.remove("wsod-route-loading");
      void body.offsetWidth;
      body.classList.add("wsod-route-loading");
      setActive(true);
    };

    if (firstRunRef.current) {
      firstRunRef.current = false;
      run();
    } else {
      run();
    }

    const timer = window.setTimeout(() => {
      body.classList.remove("wsod-route-loading");
      setActive(false);
    }, REVEAL_MS);

    return () => {
      window.clearTimeout(timer);
      body.classList.remove("wsod-route-loading");
    };
  }, [pathname]);

  if (!active) return null;

  return <div className="wsod-page-reveal-overlay" aria-hidden="true" />;
}
