"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = window.scrollY / scrollable;
      setProgress(Math.min(1, Math.max(0, ratio)));
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-[60] h-1 bg-border/60"
    >
      <div
        className="h-full bg-accent-indigo origin-left transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
