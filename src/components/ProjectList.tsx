"use client";

import Link from "next/link";
import type { ProjectListItem } from "@/lib/projects";

export function ProjectList({ projects, limitOnMobile }: { projects: ProjectListItem[]; limitOnMobile?: boolean }) {
    if (projects.length === 0) {
        return <p className="text-sm text-text-muted">No projects yet.</p>;
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {projects.map((p, i) => (
                    <Link key={p.slug} href={`/projects/${p.slug}`} className={`group ${limitOnMobile && i > 0 ? "hidden sm:block" : ""}`}>
                        <div className="flex items-center justify-start p-4 rounded-xl border border-border bg-surface-hover/30 hover:bg-surface-hover transition-colors">
                            <h3 className="text-sm font-semibold text-text-main font-serif group-hover:underline">{p.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            {limitOnMobile && projects.length > 1 && (
                <div className="mt-4 sm:hidden">
                    <Link
                        href="/projects"
                        className="text-sm underline underline-offset-4 hover:opacity-80 text-text-main"
                    >
                        View all projects
                    </Link>
                </div>
            )}
        </>
    );
}
