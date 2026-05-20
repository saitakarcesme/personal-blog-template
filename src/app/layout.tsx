import type { Metadata } from "next";
import localFont from "next/font/local";
import { CursorDots } from "@/components/CursorDots";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const solidMono = localFont({
  variable: "--font-solid-mono",
  display: "swap",
  src: [
    { path: "./fonts/Solid-Mono.ttf", weight: "400", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "A minimal personal blog and podcast hub.",
  icons: {
    icon: "/profilepic.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={solidMono.variable}>
      <body suppressHydrationWarning className="antialiased">
        <SiteHeader />
        {children}
        <CursorDots />
      </body>
    </html>
  );
}
