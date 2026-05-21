"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { MeteorShower } from "@/components/MeteorShower";

const STORAGE_KEY = "isa-splash-seen";

function subscribe() {
  return () => {};
}

function hasSeenSplash() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function SplashScreen() {
  const seen = useSyncExternalStore(subscribe, hasSeenSplash, () => false);
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const visible = !seen && !dismissed;

  const dismiss = useCallback(() => {
    setClosing((alreadyClosing) => {
      if (alreadyClosing) return alreadyClosing;
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
        document.documentElement.setAttribute("data-splash", "seen");
      } catch {
        // ignore
      }
      window.setTimeout(() => setDismissed(true), 600);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="isa-splash"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background transition-opacity duration-500 ease-out ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <MeteorShower className="h-full w-full" />
        <div className="splash-glow" />
        <div className="absolute inset-0 splash-grid" />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center px-6 text-center ${
          closing ? "" : "splash-enter"
        }`}
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-text-subtle">
          Welcome
        </p>
        <h1 className="splash-title font-serif text-7xl font-bold leading-none tracking-tight sm:text-8xl">
          ISA
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
          Ideas, projects, and notes from Ibrahim Sait.
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="splash-cta group mt-12 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-7 py-3 text-sm font-medium text-text-main backdrop-blur transition-all duration-200 hover:border-accent-indigo/60 hover:bg-surface-hover"
        >
          Continue
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
