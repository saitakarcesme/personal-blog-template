"use client";

/**
 * Subtle white-on-dark meteor shower for use as a background element.
 *
 * Each meteor is a short straight segment with a head-to-tail brightness
 * gradient plus a small radial halo at the head. Meteors travel top-right
 * to bottom-left at random angles around 135° (screen-space CCW from +x).
 * Sizes, speeds, and spawn intervals are randomised, with an occasional
 * larger/brighter meteor mixed in.
 *
 * - 60fps via requestAnimationFrame, dt-based motion (frame-rate independent)
 * - IntersectionObserver pauses the loop when off-screen
 * - Respects prefers-reduced-motion (renders nothing)
 */

import { useEffect, useRef } from "react";

type Meteor = {
  x: number;
  y: number;
  vx: number; // px/sec
  vy: number; // px/sec
  length: number;
  width: number;
  brightness: number; // 0..1, peak alpha at the head
  big: boolean;
};

export function MeteorShower({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sizing — render at devicePixelRatio for crisp lines.
    let CSS_W = 0;
    let CSS_H = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      CSS_W = rect.width;
      CSS_H = rect.height;
      canvas.width = Math.max(1, Math.round(CSS_W * dpr));
      canvas.height = Math.max(1, Math.round(CSS_H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const meteors: Meteor[] = [];

    function spawn(big: boolean) {
      // Direction: down-left in screen coords (y points down).
      // Angle range 118°–152° gives ~30°–60° steepness off horizontal.
      const angleRad = ((118 + Math.random() * 34) * Math.PI) / 180;
      const cosA = Math.cos(angleRad); // < 0
      const sinA = Math.sin(angleRad); // > 0

      // Spawn just outside the top edge (most of the time) or the right edge.
      let x: number;
      let y: number;
      if (Math.random() < 0.65) {
        // Top edge — bias toward the right half so the diagonal traverses
        // a visible portion of the canvas before exiting bottom-left.
        x = -CSS_W * 0.2 + Math.random() * CSS_W * 1.4;
        y = -30 - Math.random() * 40;
      } else {
        // Right edge — only upper half.
        x = CSS_W + 30 + Math.random() * 40;
        y = -20 + Math.random() * CSS_H * 0.7;
      }

      let speed: number;
      let length: number;
      let width: number;
      let brightness: number;
      if (big) {
        speed = 380 + Math.random() * 220;
        length = 170 + Math.random() * 140;
        width = 1.6 + Math.random() * 0.8;
        brightness = 0.85 + Math.random() * 0.15;
      } else {
        speed = 220 + Math.random() * 380;
        length = 55 + Math.random() * 130;
        width = 0.5 + Math.random() * 0.9;
        brightness = 0.3 + Math.random() * 0.45;
      }

      meteors.push({
        x,
        y,
        vx: cosA * speed,
        vy: sinA * speed,
        length,
        width,
        brightness,
        big,
      });
    }

    // Seed a few in-flight so the section never opens completely empty.
    if (!reduceMotion) {
      for (let i = 0; i < 3; i++) spawn(false);
    }

    let raf = 0;
    let lastT = performance.now();
    let lastBigSpawn = lastT;
    let nextBigDelay = 5000 + Math.random() * 7000;
    let smallSpawnAcc = 0;
    let nextSmallDelay = 180;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!isVisible) {
        lastT = now;
        return;
      }
      if (reduceMotion) return;

      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      // Spawn small meteors at irregular intervals.
      smallSpawnAcc += dt * 1000;
      if (smallSpawnAcc > nextSmallDelay) {
        smallSpawnAcc = 0;
        spawn(false);
        if (Math.random() < 0.2) spawn(false); // occasional pair burst
        nextSmallDelay = 100 + Math.random() * 700;
      }

      // Occasional big/bright meteor.
      if (now - lastBigSpawn > nextBigDelay) {
        spawn(true);
        lastBigSpawn = now;
        nextBigDelay = 5000 + Math.random() * 8000;
      }

      // Advance, then cull anything past the bottom-left corner.
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.x < -m.length - 30 || m.y > CSS_H + m.length + 30) {
          meteors.splice(i, 1);
        }
      }

      // Draw.
      ctx.clearRect(0, 0, CSS_W, CSS_H);
      ctx.lineCap = "round";

      for (const m of meteors) {
        const sp = Math.hypot(m.vx, m.vy);
        const ux = m.vx / sp;
        const uy = m.vy / sp;
        const tailX = m.x - ux * m.length;
        const tailY = m.y - uy * m.length;

        // Tail — gradient from transparent at the back to bright at the head.
        const tail = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        tail.addColorStop(0, "rgba(255,255,255,0)");
        tail.addColorStop(
          0.65,
          `rgba(240,240,240,${(m.brightness * 0.35).toFixed(3)})`,
        );
        tail.addColorStop(1, `rgba(255,255,255,${m.brightness.toFixed(3)})`);
        ctx.strokeStyle = tail;
        ctx.lineWidth = m.width;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Head halo — soft radial glow.
        const haloR = (m.big ? 8 : 5) + m.width * 1.5;
        const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, haloR);
        halo.addColorStop(0, `rgba(255,255,255,${m.brightness.toFixed(3)})`);
        halo.addColorStop(
          0.45,
          `rgba(255,255,255,${(m.brightness * 0.35).toFixed(3)})`,
        );
        halo.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(m.x, m.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Sharp core dot at the head.
        ctx.fillStyle = `rgba(255,255,255,${m.brightness.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
