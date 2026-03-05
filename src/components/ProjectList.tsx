"use client";

import Link from "next/link";
import { projects } from "../../data/projects";
import { useThemeClasses } from "./useThemeClasses";

export function ProjectList({ limitOnMobile }: { limitOnMobile?: boolean } = {}) {
    const tc = useThemeClasses();

    if (projects.length === 0) {
        return <p className={`text-sm ${tc.textMuted}`}>No projects yet.</p>;
    }

    return (
        <>
            <div className="flex flex-col gap-3 pr-2">
                {projects.map((p, i) => (
                    <Link key={i} href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={limitOnMobile && i > 0 ? "hidden sm:block" : ""}>
                        <div className={`flex items-center justify-center p-4 ${tc.listItem}`}>
                            <h3 className={`text-sm font-medium ${tc.text}`}>{p.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            {limitOnMobile && projects.length > 1 && (
                <div className="mt-4 sm:hidden">
                    <Link
                        href="/projects"
                        className={`text-sm underline underline-offset-4 hover:opacity-80 ${tc.text}`}
                    >
                        View all projects
                    </Link>
                </div>
            )}
        </>
    );
}
