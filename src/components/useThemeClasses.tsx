"use client";

import { useTheme, Theme } from "./ThemeProvider";

type ThemeClasses = {
    card: string;
    listItem: string;
    title: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    socialBtn: string;
    accent: string;
    ring: string;
    selection: string;
};

const themes: Record<Theme, ThemeClasses> = {
    // ── 🌙 Dark Minimal (Original) ──────────────────────────
    default: {
        card: "rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur",
        listItem: "rounded-xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.06]",
        title: "text-white/80",
        text: "text-white/90",
        textMuted: "text-white/60",
        textSubtle: "text-white/50",
        socialBtn: "border border-white/10 bg-black/20 text-white/80 hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
        accent: "text-indigo-400",
        ring: "ring-1 ring-white/15",
        selection: "selection:bg-indigo-500/35",
    },

    // ── 🌊 Midnight Ocean ───────────────────────────────────
    // Deep navy with warm amber/gold accents. Cozy and professional.
    "midnight-ocean": {
        card: "rounded-2xl border border-sky-900/50 bg-[#0c1929]/80 p-5 backdrop-blur-sm",
        listItem: "rounded-xl border border-sky-900/40 bg-[#0a1525]/60 px-4 py-4 transition hover:border-amber-500/30 hover:bg-[#0e1d33]/80",
        title: "text-amber-400 font-semibold",
        text: "text-sky-100",
        textMuted: "text-sky-200/70",
        textSubtle: "text-sky-300/50",
        socialBtn: "border border-sky-800/50 bg-[#0a1525]/60 text-sky-200 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300",
        accent: "text-amber-400",
        ring: "ring-1 ring-sky-800/50",
        selection: "selection:bg-amber-500/30",
    },

    // ── 🧛 Dracula ──────────────────────────────────────────
    // The iconic Dracula color scheme — purple bg, pink/green/cyan accents.
    dracula: {
        card: "rounded-2xl border border-[#6272a4]/40 bg-[#282a36]/90 p-5 backdrop-blur-sm",
        listItem: "rounded-xl border border-[#6272a4]/30 bg-[#21222c]/80 px-4 py-4 transition hover:border-[#bd93f9]/40 hover:bg-[#2d2f3d]/80",
        title: "text-[#bd93f9] font-semibold",
        text: "text-[#f8f8f2]",
        textMuted: "text-[#f8f8f2]/70",
        textSubtle: "text-[#6272a4]",
        socialBtn: "border border-[#6272a4]/40 bg-[#21222c]/80 text-[#f8f8f2] hover:border-[#ff79c6]/50 hover:bg-[#ff79c6]/10 hover:text-[#ff79c6]",
        accent: "text-[#50fa7b]",
        ring: "ring-1 ring-[#6272a4]/50",
        selection: "selection:bg-[#bd93f9]/30",
    },

    // ── ☀️ Solarized Dark ───────────────────────────────────
    // Ethan Schoonover's scientifically designed palette for readability.
    solarized: {
        card: "rounded-2xl border border-[#073642] bg-[#002b36]/90 p-5",
        listItem: "rounded-xl border border-[#073642] bg-[#073642]/60 px-4 py-4 transition hover:border-[#268bd2]/40 hover:bg-[#073642]/90",
        title: "text-[#b58900] font-semibold",
        text: "text-[#93a1a1]",
        textMuted: "text-[#839496]",
        textSubtle: "text-[#657b83]",
        socialBtn: "border border-[#073642] bg-[#073642]/60 text-[#93a1a1] hover:border-[#268bd2]/50 hover:bg-[#268bd2]/10 hover:text-[#268bd2]",
        accent: "text-[#268bd2]",
        ring: "ring-1 ring-[#073642]",
        selection: "selection:bg-[#268bd2]/25",
    },

    // ── 🌹 Rosé Pine ────────────────────────────────────────
    // Elegant, muted rose and gold tones on a warm dark base.
    "rose-pine": {
        card: "rounded-2xl border border-[#26233a] bg-[#1f1d2e]/90 p-5 backdrop-blur-sm",
        listItem: "rounded-xl border border-[#26233a] bg-[#191724]/70 px-4 py-4 transition hover:border-[#c4a7e7]/30 hover:bg-[#26233a]/60",
        title: "text-[#c4a7e7] font-semibold",
        text: "text-[#e0def4]",
        textMuted: "text-[#908caa]",
        textSubtle: "text-[#6e6a86]",
        socialBtn: "border border-[#26233a] bg-[#191724]/70 text-[#e0def4] hover:border-[#ebbcba]/40 hover:bg-[#ebbcba]/10 hover:text-[#ebbcba]",
        accent: "text-[#ebbcba]",
        ring: "ring-1 ring-[#26233a]",
        selection: "selection:bg-[#c4a7e7]/25",
    },

    // ── 🐱 Catppuccin Mocha ─────────────────────────────────
    // Warm, soothing pastels on a rich chocolate dark base.
    catppuccin: {
        card: "rounded-2xl border border-[#313244] bg-[#1e1e2e]/90 p-5 backdrop-blur-sm",
        listItem: "rounded-xl border border-[#313244] bg-[#181825]/70 px-4 py-4 transition hover:border-[#cba6f7]/30 hover:bg-[#313244]/50",
        title: "text-[#cba6f7] font-semibold",
        text: "text-[#cdd6f4]",
        textMuted: "text-[#a6adc8]",
        textSubtle: "text-[#6c7086]",
        socialBtn: "border border-[#313244] bg-[#181825]/70 text-[#cdd6f4] hover:border-[#f5c2e7]/40 hover:bg-[#f5c2e7]/10 hover:text-[#f5c2e7]",
        accent: "text-[#f38ba8]",
        ring: "ring-1 ring-[#313244]",
        selection: "selection:bg-[#cba6f7]/25",
    },
};

export function useThemeClasses(): ThemeClasses {
    const { theme } = useTheme();
    return themes[theme];
}
