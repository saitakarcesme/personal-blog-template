import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { CursorDots } from "@/components/CursorDots";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${newsreader.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <CursorDots />
      </body>
    </html>
  );
}
