"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { publishChanges } from "@/actions/adminActions";
import { FiEdit3, FiGrid, FiMic, FiUploadCloud } from "react-icons/fi";

export default function AdminDashboard() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });

    const handlePublish = () => {
        startTransition(async () => {
            const result = await publishChanges();
            setStatus({ type: result.success ? "success" : "error", message: result.message });
        });
    };

    return (
        <div className="flex flex-col items-center pt-8 fade-in">
            <h1 className="text-4xl font-serif font-bold text-text-main text-center tracking-tight">Admin Overview</h1>
            <p className="text-text-muted text-center max-w-lg mt-3">
                Manage your content locally. Changes are saved instantly to the filesystem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl mt-12 px-4">
                <Link href="/admin/posts/new" className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border border-border bg-surface-hover/30 hover:bg-surface-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FiEdit3 />
                    </div>
                    <span className="text-lg font-serif font-bold text-text-main">New Post</span>
                    <span className="text-xs text-text-subtle text-center">Write a new article</span>
                </Link>
                <Link href="/admin/projects/new" className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border border-border bg-surface-hover/30 hover:bg-surface-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FiGrid />
                    </div>
                    <span className="text-lg font-serif font-bold text-text-main">New Project</span>
                    <span className="text-xs text-text-subtle text-center">Add portfolio work</span>
                </Link>
                <Link href="/admin/podcasts/new" className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border border-border bg-surface-hover/30 hover:bg-surface-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FiMic />
                    </div>
                    <span className="text-lg font-serif font-bold text-text-main">New Podcast</span>
                    <span className="text-xs text-text-subtle text-center">Link YouTube episode</span>
                </Link>
            </div>

            <div className="w-full max-w-xl mt-16 pt-10 flex flex-col items-center">
                <button 
                    onClick={handlePublish}
                    disabled={isPending}
                    className="w-full py-4 px-6 rounded-xl font-bold text-background bg-accent hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    <FiUploadCloud className="text-xl" />
                    {isPending ? "Publishing to GitHub..." : "Commit & Publish Changes"}
                </button>

                {status.type && (
                    <div className={`mt-6 p-4 rounded-xl text-sm w-full border ${status.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400" : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"}`}>
                        {status.message}
                    </div>
                )}
                
                <p className="text-xs text-center text-text-subtle mt-4 max-w-md">
                    Triggering this will run standard git hooks and push to origin, signaling Vercel to rebuild.
                </p>
            </div>
        </div>
    );
}
