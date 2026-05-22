"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function TerminalHotkey() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isPalette =
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p";
      if (!isPalette || e.isComposing) return;
      if (pathname === "/terminal") return;
      e.preventDefault();
      router.push("/terminal");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}
