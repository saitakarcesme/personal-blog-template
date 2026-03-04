"use client";

import Link from "next/link";
import { projects } from "../../data/projects";
import { useThemeClasses } from "./useThemeClasses";

export function ProjectList() {
    const tc = useThemeClasses();

    if (projects.length === 0) {
        return <p className={`text-sm ${tc.textMuted}`}>No projects yet.</p>;
    }

    return (
        <div className="flex flex-col gap-3 pr-2">
            {projects.map((p, i) => (
                <Link key={i} href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                    <div className={`flex items-center justify-center p-4 ${tc.listItem}`}>
                        <h3 className={`text-sm font-medium ${tc.text}`}>{p.title}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}
