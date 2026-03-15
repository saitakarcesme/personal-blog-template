"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileProfileButton() {
    const pathname = usePathname();

    // Don't show on the profile page itself
    if (pathname === "/profile") return null;

    return (
        <div className="fixed top-4 left-4 z-[9999] min-[1300px]:hidden">
            <Link
                href="/profile"
                className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shadow-lg transition-transform hover:scale-105 ring-2 ring-border"
            >
                <Image
                    src="/profilepic.jpeg"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full aspect-square"
                />
            </Link>
        </div>
    );
}
