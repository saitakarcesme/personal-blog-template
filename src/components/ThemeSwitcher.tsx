"use client";

import { useTheme } from "./ThemeProvider";
import { FiSun, FiMoon } from "react-icons/fi";

export function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="fixed top-4 right-4 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-text-main transition-all duration-200 hover:bg-surface-hover shadow-sm"
        >
            {theme === "light" ? (
                <FiMoon className="h-5 w-5" />
            ) : (
                <FiSun className="h-5 w-5" />
            )}
        </button>
    );
}
