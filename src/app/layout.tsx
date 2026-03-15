import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { CursorDots } from "@/components/CursorDots";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { MobileProfileButton } from "@/components/MobileProfileButton";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${newsreader.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <CursorDots />
          <ThemeSwitcher />
          <MobileProfileButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
