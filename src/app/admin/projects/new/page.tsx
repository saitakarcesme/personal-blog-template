"use client";

import { useTransition } from "react";
import { saveProject } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { FiGrid } from "react-icons/fi";

export default function NewProjectPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent">
                    <FiGrid />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-main">New Project</h1>
                    <p className="text-sm text-text-muted">Showcase your latest work.</p>
                </div>
            </div>
            
            <form action={(formData) => {
                startTransition(async () => {
                    await saveProject(formData);
                    router.push("/admin");
                });
            }} className="space-y-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Project Title</label>
                        <input name="title" required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" placeholder="Project Name" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Date</label>
                        <input name="date" required type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">GitHub URL</label>
                    <input name="githubUrl" required type="url" placeholder="https://github.com/..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Description / Features (Markdown)</label>
                    <textarea name="content" required rows={10} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all resize-y leading-relaxed" placeholder="Brief description and feature bullet points..." />
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                    <button type="submit" disabled={isPending} className="bg-accent text-background px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md">
                        {isPending ? "Saving..." : "Save Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}
