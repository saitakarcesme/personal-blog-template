import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CursorDots } from "@/components/CursorDots";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <CursorDots />
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
