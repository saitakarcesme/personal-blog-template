import type { ReactNode } from "react";

export function PageShell({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide";
}) {
  const maxWidth = width === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <main
      className={`mx-auto min-h-[calc(100dvh-5rem)] w-full ${maxWidth} px-4 py-10 text-foreground sm:px-6 lg:px-8 ${
        className ?? ""
      }`}
    >
      {children}
    </main>
  );
}
