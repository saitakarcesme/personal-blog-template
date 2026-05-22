"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function TerminalHotkey() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "`" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.isComposing) return;
      if (pathname === "/terminal") return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      router.push("/terminal");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}
