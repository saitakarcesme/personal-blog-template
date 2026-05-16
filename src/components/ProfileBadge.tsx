"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ibrahim-sait-akarcesme-4b360b209/",
    icon: <FaLinkedinIn />,
  },
  {
    label: "GitHub",
    href: "https://github.com/saitakarcesme",
    icon: <FaGithub />,
  },
  { label: "X", href: "https://x.com/IbrahimSait_", icon: <FaXTwitter /> },
];

/**
 * ProfileBadge — a real 3D access pass on a flexible cord.
 *
 * The card is a true 3D object (perspective + preserve-3d, front/back
 * faces with backface-visibility, an extruded edge) that rotates around
 * its OWN CENTRE on click-drag, so you can turn it right around and read
 * the back.
 *
 * The cord is NOT a DOM rectangle. Every frame we read the on-screen
 * position of a 0×0 marker that lives INSIDE the 3D card (so its rect
 * already reflects the live transform) and the fixed anchor, then redraw
 * an SVG Bézier between them with gravity sag + a velocity-driven lag.
 * Because it is painted to the real projected attachment point, it always
 * connects, bends like a string, and can never clip through the card.
 *
 * Motion: nothing on hover (cursor readiness only). Pointer-down holds
 * the card; a per-axis spring-damper (rAF) gives lag, momentum on
 * release, and a smooth settle. Reduced motion → static, front-facing.
 */
export function ProfileBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardPivotRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const grommetRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const cordHiRef = useRef<SVGPathElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const pivot = cardPivotRef.current;
    const anchor = anchorRef.current;
    const grommet = grommetRef.current;
    const svg = svgRef.current;
    const cord = cordRef.current;
    const cordHi = cordHiRef.current;
    const glare = glareRef.current;
    if (!stage || !pivot || !anchor || !grommet || !svg || !cord || !cordHi)
      return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pos = { x: 0, y: 0, z: 0, t: 0 };
    const vel = { x: 0, y: 0, z: 0, t: 0 };
    const target = { x: 0, y: 0, z: 0, t: 0 };
    const K = { x: 120, y: 115, z: 40, t: 90 };
    const C = { x: 17, y: 16, z: 7, t: 16 };

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let last = performance.now();
    let raf = 0;

    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));

    const drawCord = () => {
      const s = stage.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const g = grommet.getBoundingClientRect();
      const w = s.width;
      const h = s.height;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const ax = a.left + a.width / 2 - s.left;
      const ay = a.top + a.height / 2 - s.top;
      const gx = g.left + g.width / 2 - s.left;
      const gy = g.top + g.height / 2 - s.top;
      const dx = gx - ax;
      const dy = gy - ay;
      const len = Math.hypot(dx, dy);
      // gravity sag + lag opposite the swing for a "liquid" string feel
      const sag = Math.max(10, len * 0.16);
      const lag = -pos.z * 1.4 - vel.z * 0.05;
      const c1x = ax + dx * 0.25 + lag * 0.5;
      const c1y = ay + dy * 0.25 + sag * 0.7;
      const c2x = ax + dx * 0.75 + lag;
      const c2y = ay + dy * 0.75 + sag;
      const d = `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${c1x.toFixed(
        1,
      )} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${gx.toFixed(
        1,
      )} ${gy.toFixed(1)}`;
      cord.setAttribute("d", d);
      cordHi.setAttribute("d", d);
    };

    if (reduce) {
      drawCord();
      return;
    }

    stage.style.cursor = "grab";

    const tick = (now: number) => {
      const dt = clamp((now - last) / 1000, 0.008, 0.04);
      last = now;

      (["x", "y", "z", "t"] as const).forEach((k) => {
        const a = K[k] * (target[k] - pos[k]) - C[k] * vel[k];
        vel[k] += a * dt;
        pos[k] += vel[k] * dt;
      });

      pivot.style.transform = `translateY(${pos.t.toFixed(
        2,
      )}px) rotateX(${pos.x.toFixed(2)}deg) rotateY(${pos.y.toFixed(
        2,
      )}deg) rotateZ(${pos.z.toFixed(2)}deg)`;

      if (glare) {
        const gg = clamp(pos.y, -90, 90);
        glare.style.transform = `translateX(${(gg * 0.9).toFixed(1)}%)`;
        glare.style.opacity = (
          0.1 +
          Math.min(0.28, Math.abs(gg) / 260)
        ).toFixed(3);
      }

      drawCord();
      raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      // let clicks on the social links (or any link) work normally —
      // don't start a drag or capture the pointer on them
      if ((e.target as HTMLElement)?.closest("a")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      target.t = -10; // slight tension lift while held
      stage.style.cursor = "grabbing";
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      target.y = clamp(dx * 0.9, -220, 220); // far enough to see the back
      target.x = clamp(-dy * 0.6, -60, 60);
      target.z = clamp(dx * 0.035, -10, 10);
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      target.x = 0;
      target.y = 0;
      target.z = 0;
      target.t = 0;
      stage.style.cursor = "grab";
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {}
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(drawCord);
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="group relative mx-auto w-full max-w-[330px] touch-none select-none pt-24 [perspective-origin:50%_30%] [perspective:900px]"
      aria-label="Personal profile access pass — drag to rotate"
    >
      {/* fixed anchor pin */}
      <div
        ref={anchorRef}
        aria-hidden
        className="absolute left-1/2 top-3 z-30 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)]"
      />

      {/* flexible cord — redrawn every frame to the real attach point */}
      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
        fill="none"
      >
        <path
          ref={cordRef}
          stroke="#0a0a0b"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          ref={cordHiRef}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>

      {/* 3D card, rotates around its own centre */}
      <div className="relative z-20 [transform-style:preserve-3d]">
        <div
          ref={cardPivotRef}
          className="relative [transform-origin:50%_50%] [transform-style:preserve-3d]"
        >
          <div className="relative [transform-style:preserve-3d]">
            {/* attach marker (0×0) — lives in the transformed card so its
                screen rect is the true projected grommet position */}
            <span
              ref={grommetRef}
              aria-hidden
              className="absolute left-1/2 top-0 h-0 w-0"
            />

            {/* extruded edge / thickness */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#2a2a2e] to-[#0b0b0c] shadow-[0_36px_70px_-26px_rgba(0,0,0,1)] [transform:translateZ(-8px)]"
            />

            {/* ===================== FRONT ===================== */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1f1f22] via-[#171719] to-[#0f0f10] p-px shadow-[0_18px_30px_-20px_rgba(0,0,0,0.9)] [backface-visibility:hidden]">
              <div className="relative rounded-[15px] bg-gradient-to-b from-[#1c1c1f] via-[#161618] to-[#101011] px-5 pb-5 pt-8">
                {/* reinforced grommet the cord enters */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-2 h-3.5 w-9 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#46464b] to-[#0c0c0d] p-[2px] shadow-[0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <div className="h-full w-full rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)]" />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[15px] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]"
                />
                <div
                  ref={glareRef}
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-6 left-0 w-2/3 rounded-2xl bg-[radial-gradient(60%_70%_at_50%_40%,rgba(255,255,255,0.14),transparent_75%)] opacity-10"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"
                />
                {(
                  [
                    "left-2 top-2 border-l border-t",
                    "right-2 top-2 border-r border-t",
                    "left-2 bottom-2 border-l border-b",
                    "right-2 bottom-2 border-r border-b",
                  ] as const
                ).map((p) => (
                  <span
                    key={p}
                    aria-hidden
                    className={`absolute h-2.5 w-2.5 border-white/12 ${p}`}
                  />
                ))}

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] font-mono text-[11px] font-bold tracking-tight text-white">
                      ISA
                    </span>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                        Personal Profile
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.15em] text-text-subtle">
                        USER&nbsp;001
                      </p>
                    </div>
                  </div>

                  {/* photo — natural colour */}
                  <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                    <Image
                      src="/profilepic.jpeg"
                      alt="Ibrahim Sait Akarcesme"
                      fill
                      sizes="330px"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.10)_4px)]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#101011] to-transparent"
                    />
                    <span className="absolute bottom-2 left-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                      ID&nbsp;//&nbsp;SCAN
                    </span>
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-text-muted backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      Active
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-serif text-xl font-bold leading-tight text-white">
                      Ibrahim Sait Akarcesme
                    </h3>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                      Builder · Student · AI-Assisted Workflow
                    </p>
                  </div>

                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-white/10 pt-3 font-mono text-[10px]">
                    <dt className="uppercase tracking-[0.14em] text-text-subtle">
                      Location
                    </dt>
                    <dd className="text-right text-text-muted">Warsaw, PL</dd>
                    <dt className="uppercase tracking-[0.14em] text-text-subtle">
                      Focus
                    </dt>
                    <dd className="text-right text-text-muted">
                      Software, AI, Personal Tools
                    </dd>
                  </dl>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-subtle">
                      Connect
                    </span>
                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                      {socials.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          aria-label={s.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[17px] text-text-muted transition-colors hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                        >
                          {s.icon}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
                    <div
                      aria-hidden
                      className="h-7 w-32 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.5)_0_1px,transparent_1px_3px,rgba(255,255,255,0.5)_3px_4px,transparent_4px_8px)] opacity-45"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-subtle">
                      ISA&nbsp;·&nbsp;001
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== BACK ===================== */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1d1d20] via-[#161618] to-[#0e0e0f] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="relative flex h-full flex-col px-5 pb-5 pt-8">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-2 h-3.5 w-9 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#46464b] to-[#0c0c0d] p-[2px]"
                >
                  <div className="h-full w-full rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)]" />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016)_0_1px,transparent_1px_7px)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
                />
                {(
                  [
                    "left-2 top-2 border-l border-t",
                    "right-2 top-2 border-r border-t",
                    "left-2 bottom-2 border-l border-b",
                    "right-2 bottom-2 border-r border-b",
                  ] as const
                ).map((p) => (
                  <span
                    key={p}
                    aria-hidden
                    className={`absolute h-2.5 w-2.5 border-white/12 ${p}`}
                  />
                ))}

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] font-mono text-[13px] font-bold text-white">
                    ISA
                  </span>
                  <div className="text-right font-mono text-[9px] uppercase tracking-[0.22em] text-text-subtle">
                    <p className="text-text-muted">Access Pass</p>
                    <p>Personal · v1</p>
                  </div>
                </div>

                {/* security panel (neutral) */}
                <div className="relative mt-4 h-9 w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,rgba(255,255,255,0.07)_0_2px,transparent_2px_6px)]" />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] uppercase tracking-[0.4em] text-white/40">
                    Secure
                  </span>
                </div>

                <dl className="relative mt-4 grid grid-cols-3 gap-2 font-mono text-[8.5px] uppercase tracking-[0.12em]">
                  {[
                    ["Issued", "2024"],
                    ["Expiry", "—"],
                    ["Class", "PRSNL"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded border border-white/10 bg-white/[0.025] px-2 py-1.5"
                    >
                      <dt className="text-text-subtle">{k}</dt>
                      <dd className="mt-0.5 text-text-muted">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="relative mt-3 font-mono text-[8px] leading-relaxed text-text-subtle/80">
                  This pass certifies a personal portfolio identity. It grants
                  no access privileges. If found, contact the holder via the
                  channels on the front. Property of I.S.A.
                </p>

                <div className="relative mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-7 flex-1 rounded-[3px] bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
                    <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-text-subtle">
                      Holder Sign
                    </span>
                  </div>
                  <div
                    aria-hidden
                    className="mt-3 h-9 w-full bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.55)_0_1px,transparent_1px_2px,rgba(255,255,255,0.55)_2px_4px,transparent_4px_5px,rgba(255,255,255,0.55)_5px_7px,transparent_7px_10px)] opacity-50"
                  />
                  <div className="mt-2 flex justify-between font-mono text-[8.5px] uppercase tracking-[0.18em] text-text-subtle">
                    <span>SN 8821-ISA-001</span>
                    <span>Warsaw · PL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
