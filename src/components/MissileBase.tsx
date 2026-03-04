"use client";

import { useEffect, useState, useRef } from "react";

type Missile = {
    id: string;
    startX: number;
    startY: number;
    controlX: number; // Added control points for Bezier curve
    controlY: number;
    targetX: number;
    targetY: number;
    progress: number;
}; // angle is now calculated dynamically during flight

type Explosion = {
    id: string;
    x: number;
    y: number;
    createdAt: number;
};

export function MissileBase() {
    const [missiles, setMissiles] = useState<Missile[]>([]);
    const [explosions, setExplosions] = useState<Explosion[]>([]);
    const [active, setActive] = useState(false);

    // Base coords at bottom left corner
    // Usually window.innerHeight for Y, but we will fix the base styling to CSS "bottom-4 left-4"
    // so we need an accurate ref to get its real absolute starting position to shoot from.
    const baseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Don't shoot if they clicked on the base itself
            if (baseRef.current?.contains(e.target as Node)) {
                return;
            }

            // Don't shoot if inactive
            if (!active) return;

            if (!baseRef.current) return;
            const baseRect = baseRef.current.getBoundingClientRect();
            // Fallback just in case bounding rect evaluates to 0,0 Top-Left before layout resolves
            const startX = baseRect.left > 0 ? baseRect.left + baseRect.width / 2 : 40;
            const startY = baseRect.top > 0 ? baseRect.top : window.innerHeight - 50;

            const targetX = e.clientX;
            const targetY = e.clientY;

            const dy = targetY - startY;
            const dx = targetX - startX;

            // Control point for a nice arc: we pull the curve "up" by subtracting from Y 
            // and offset X slightly to bend the trajectory
            const arcHeight = Math.min(Math.abs(dx) * 0.5, 400); // arc height scales with horizontal distance
            const controlX = startX + dx * 0.4; // Slightly offset peak
            const controlY = Math.min(startY, targetY) - arcHeight - 100;

            const newMissile: Missile = {
                id: `missile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Guarantee absolutely unique ID
                startX,
                startY,
                controlX,
                controlY,
                targetX,
                targetY,
                progress: 0,
            };

            setMissiles((prev) => [...prev, newMissile]);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [active]);

    // Animation Loop
    useEffect(() => {
        let rafId: number;
        let lastTime = performance.now();

        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            setMissiles((prev) => {
                let hasChanges = false;
                const nextMissiles = prev.map((m) => {
                    // Progress goes from 0 to 1
                    // Speed: 1 takes roughly 400ms to arrive, independent of distance makes short shots fast, long shots slow. Let's make it fixed velocity instead.
                    // Prevent dist from being 0.0 which breaks delta math division and creates NaN crashes
                    const dist = Math.max(1, Math.sqrt(
                        Math.pow(m.targetX - m.startX, 2) + Math.pow(m.targetY - m.startY, 2)
                    ));

                    // pixels per ms (e.g. 1500px / sec)
                    const velocity = 1.5;
                    const duration = dist / velocity;

                    const newProgress = m.progress + delta / duration;

                    if (newProgress !== m.progress) {
                        hasChanges = true;
                    }

                    return { ...m, progress: newProgress };
                });

                // Check for Impacts
                const remaining: Missile[] = [];
                const newExplosions: Explosion[] = [];

                nextMissiles.forEach((m) => {
                    if (m.progress >= 1) {
                        hasChanges = true;
                        newExplosions.push({
                            id: `explosion-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // ENFORCE UNIQUE KEY ALWAYS
                            x: m.targetX,
                            y: m.targetY,
                            createdAt: Date.now(),
                        });
                    } else {
                        remaining.push(m);
                    }
                });

                if (newExplosions.length > 0) {
                    setExplosions((prevEx) => [...prevEx, ...newExplosions]);
                }

                return hasChanges ? remaining : prev;
            });

            // Cleanup old explosions
            setExplosions((prev) => {
                const now = Date.now();
                const filtered = prev.filter((ex) => now - ex.createdAt < 500); // 500ms explosion life
                return filtered.length !== prev.length ? filtered : prev;
            });

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, []);


    return (
        <>
            {/* Launch Base in Bottom Left */}
            <div
                ref={baseRef}
                onClick={() => setActive((prev) => !prev)}
                className="fixed bottom-4 left-4 z-50 flex h-10 w-12 cursor-pointer flex-col items-center justify-end rounded-t flex-col-reverse group transition-transform hover:scale-110"
                title={active ? "Missile base ACTIVE — click to deactivate" : "Missile base INACTIVE — click to activate"}
            >
                {/* Base Platform */}
                <div className={`h-4 w-12 bg-zinc-800 border-t-2 rounded flex justify-center transition-colors ${active
                    ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    }`}>
                    <div className="h-2 w-6 bg-zinc-900 absolute bottom-4"></div>
                </div>
                {/* Status indicator */}
                <div className={`h-2 w-2 rounded-full animate-pulse absolute top-1 transition-colors ${active
                    ? "bg-green-500 drop-shadow-[0_0_5px_green]"
                    : "bg-red-500 drop-shadow-[0_0_5px_red]"
                    }`}></div>
            </div>

            {/* Missiles */}
            {missiles.map((m) => {
                // Quadratic Bezier Curve interpolation
                const t = Math.min(m.progress, 1); // Clamp to prevent overshoot NaN
                const mt = 1 - t; // One minus t

                // Standard bezier curve formula
                const currentX = (mt * mt * m.startX) + (2 * mt * t * m.controlX) + (t * t * m.targetX);
                const currentY = (mt * mt * m.startY) + (2 * mt * t * m.controlY) + (t * t * m.targetY);

                // To calculate angle dynamically as it travels the curve, we find the derivative (tangent)
                const dx = 2 * mt * (m.controlX - m.startX) + 2 * t * (m.targetX - m.controlX);
                const dy = 2 * mt * (m.controlY - m.startY) + 2 * t * (m.targetY - m.controlY);
                // Math.atan2(0,0) is NaN, provide a fallback if slope is 0 to avoid crashing CSS left/top values
                const dynamicAngle = (dx === 0 && dy === 0) ? m.targetY : Math.atan2(dy, dx) * (180 / Math.PI) + 90;

                return (
                    <div
                        key={m.id}
                        className="fixed pointer-events-none z-[100]"
                        style={{
                            left: currentX,
                            top: currentY,
                            transform: `translate(-50%, -50%) rotate(${dynamicAngle}deg)`,
                            // roughly 16x16 size matching standard cursor
                            width: 12,
                            height: 20,
                        }}
                    >
                        {/* Actual Missile Body */}
                        <div className="w-full h-full relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-red-600 rounded-t-[50%] z-10"></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-zinc-300 z-10"></div>
                            {/* Fire Tail */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-orange-500 rounded-b-full animate-pulse shadow-[0_5px_10px_orange]"></div>
                        </div>
                    </div>
                );
            })}

            {/* Explosions */}
            {explosions.map((ex) => (
                <div
                    key={ex.id}
                    className="fixed pointer-events-none z-[100] animate-ping"
                    style={{
                        left: ex.x,
                        top: ex.y,
                        transform: "translate(-50%, -50%)",
                        width: 24, // Small explosion relative to cursor
                        height: 24,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,165,0,0.8) 50%, rgba(255,0,0,0) 100%)",
                        boxShadow: "0 0 20px 5px rgba(255,100,0,0.5)",
                    }}
                />
            ))}
        </>
    );
}
