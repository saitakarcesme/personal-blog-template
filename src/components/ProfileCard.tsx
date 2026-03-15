"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { TetrisGame } from "@/components/TetrisGame";

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
    return (
        <div className="flex flex-col">
            <div className="relative shrink-0 h-24 w-24 min-[1300px]:h-32 min-[1300px]:w-32 overflow-hidden rounded-full ring-1 ring-ring mb-4">
                <Image
                    src="/profilepic.jpeg"
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="mt-4 flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-text-main font-serif">
                    Ibrahim Sait Akarcesme
                </h1>
                <p className="text-base font-medium text-text-muted mt-1">
                    Computer Science Student
                </p>
                <p className="mt-3 text-sm max-w-[280px] leading-relaxed text-text-subtle font-serif">
                    Passionate about building software, exploring new technologies, and sharing my thoughts here.
                </p>
            </div>

            <div className="mt-6 flex flex-row items-center gap-3">
                {socials.map((s) => (
                    <Link
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-base text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border"
                    >
                        {s.icon}
                    </Link>
                ))}
            </div>

            <TetrisGame />
        </div>
    );
}
