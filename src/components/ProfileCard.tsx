"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { TetrisGame } from "@/components/TetrisGame";
import { useThemeClasses } from "./useThemeClasses";

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ibrahim-sait-akarcesme-4b360b209/", icon: <FaLinkedinIn /> },
  { label: "GitHub", href: "https://github.com/saitakarcesme", icon: <FaGithub /> },
  { label: "X", href: "https://x.com/IbrahimSait_", icon: <FaXTwitter /> },
];

export function ProfileCard() {
  const tc = useThemeClasses();

  return (
    <div className="flex flex-col items-center">
      <div className={`relative h-64 w-64 overflow-hidden rounded-full ${tc.ring}`}>
        <Image
          src="/profilepic.jpeg"
          alt="Profile"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-1 text-center">
        <h1 className={`text-xl font-bold tracking-tight ${tc.text}`}>
          Ibrahim Sait Akarcesme
        </h1>
        <p className={`text-sm font-medium ${tc.textMuted}`}>
          Computer Science Student :(
        </p>
        <p className={`mt-2 text-xs max-w-[200px] leading-relaxed ${tc.textSubtle}`}>
          Passionate about building software, exploring new technologies, and sharing my thoughts here.
        </p>
      </div>

      <div className="mt-6 flex flex-row items-center justify-center gap-4">
        {socials.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-xl transition ${tc.socialBtn}`}
          >
            {s.icon}
          </Link>
        ))}
      </div>

      <TetrisGame />
    </div>
  );
}
