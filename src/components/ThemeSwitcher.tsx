"use client";

import { useTheme, Theme } from "./ThemeProvider";
import { useThemeClasses } from "./useThemeClasses";
import { useState, useRef, useEffect } from "react";

const THEMES: { id: Theme; label: string; icon: string }[] = [
    { id: "default", label: "Dark Minimal", icon: "🌙" },
    { id: "midnight-ocean", label: "Midnight Ocean", icon: "🌊" },
    { id: "dracula", label: "Dracula", icon: "🧛" },
    { id: "solarized", label: "Solarized Dark", icon: "☀️" },
    { id: "rose-pine", label: "Rosé Pine", icon: "🌹" },
    { id: "catppuccin", label: "Catppuccin", icon: "🐱" },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const tc = useThemeClasses();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

    return (
        <div className="fixed top-4 right-4 z-[9999]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors shadow-lg ${tc.card}`}
                style={{ padding: "8px 16px" }}
            >
                <span>{currentTheme.icon}</span>
                <span className={`hidden sm:inline font-medium ${tc.text}`}>{currentTheme.label}</span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 overflow-hidden shadow-2xl ${tc.card}`} style={{ padding: 0 }}>
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTheme(t.id);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${theme === t.id
                                    ? `font-medium ${tc.text}`
                                    : `${tc.textMuted} hover:opacity-80`
                                }`}
                        >
                            <span className="text-lg">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
