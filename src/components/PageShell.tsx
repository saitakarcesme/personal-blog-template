import type { ReactNode } from "react";
import {
  SectionWallpaper,
  type SectionWallpaperTheme,
} from "@/components/SectionWallpaper";

export function PageShell({
  children,
  className,
  width = "default",
  wallpaper,
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide";
  wallpaper?: SectionWallpaperTheme;
}) {
  const maxWidth = width === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <main
      className="relative isolate min-h-[calc(100dvh-5rem)] w-full overflow-hidden text-foreground"
    >
      {wallpaper ? <SectionWallpaper theme={wallpaper} /> : null}
      <div
        className={`relative z-10 mx-auto w-full ${maxWidth} px-4 py-10 sm:px-6 lg:px-8 ${
          className ?? ""
        }`}
      >
        {children}
      </div>
    </main>
  );
}
