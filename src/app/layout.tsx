import type { Metadata } from "next";
import localFont from "next/font/local";
import { CursorDots } from "@/components/CursorDots";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

// Runs before paint: hide the splash for returning sessions and arm the
// scroll-reveal hidden state so content doesn't flash before animating in.
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('reveal-ready');if(sessionStorage.getItem('isa-splash-seen')==='1'){d.setAttribute('data-splash','seen');}}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <SplashScreen />
        <SiteHeader />
        {children}
        <SearchOverlay />
        <ScrollReveal />
        <CursorDots />
      </body>
    </html>
  );
}
