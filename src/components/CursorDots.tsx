"use client";

import { useEffect, useState, useRef } from "react";

// Comet trail settings
const TRAIL_LENGTH = 15;
const COLORS = [
  "rgba(14, 165, 233, 0.8)", // Sky blue
  "rgba(99, 102, 241, 0.8)", // Indigo
  "rgba(168, 85, 247, 0.8)", // Purple
];

type Point = {
  x: number;
  y: number;
  timestamp: number;
};

export function CursorDots() {
  const [trail, setTrail] = useState<Point[]>([]);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(null);

  useEffect(() => {
    let currentX = 0;
    let currentY = 0;

    // Smooth lerping target
    let targetX = 0;
    let targetY = 0;

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    const animate = () => {
      // Lerp for smooth trailing
      currentX += (targetX - currentX) * 0.4;
      currentY += (targetY - currentY) * 0.4;

      setTrail((prev) => {
        const now = Date.now();
        // Remove points older than 150ms
        const filtered = prev.filter((p) => now - p.timestamp < 150);

        // Add new point only if we've moved enough (optimization)
        const lastPoint = filtered[filtered.length - 1];
        if (
          !lastPoint ||
          Math.abs(lastPoint.x - currentX) > 2 ||
          Math.abs(lastPoint.y - currentY) > 2
        ) {
          filtered.push({ x: currentX, y: currentY, timestamp: now });
        }

        // Keep to max length
        if (filtered.length > TRAIL_LENGTH) {
          filtered.shift();
        }
        return filtered;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] select-none hidden sm:block"
      aria-hidden
    >
      {trail.map((point, i) => {
        // Calculate dynamic properties based on position in trail
        // Older points (lower index) are smaller and more transparent
        const ratio = (i + 1) / trail.length;
        const size = Math.max(2, 12 * Math.pow(ratio, 2));

        // Cycle colors
        const colorIndex = Math.floor(ratio * (COLORS.length - 1));
        const color = COLORS[colorIndex];

        // Opacity drops heavily on the tail
        const opacity = Math.pow(ratio, 1.5);

        return (
          <div
            key={point.timestamp}
            className="absolute rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-none"
            style={{
              left: point.x,
              top: point.y,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              opacity: opacity,
              filter: `blur(${Math.max(0, 4 - ratio * 4)}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
