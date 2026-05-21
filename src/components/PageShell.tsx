import { Children, type CSSProperties, type ReactNode } from "react";
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

  const revealed = Children.map(children, (child, index) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return child;
    }
    const delay = `${Math.min(index, 5) * 70}ms`;
    return (
      <div data-reveal style={{ "--reveal-delay": delay } as CSSProperties}>
        {child}
      </div>
    );
  });

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
        {revealed}
      </div>
    </main>
  );
}
