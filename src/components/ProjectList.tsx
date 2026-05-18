import Link from "next/link";
import type { ProjectListItem } from "@/lib/projects";

export function ProjectList({
  projects,
  limitOnMobile,
}: {
  projects: ProjectListItem[];
  limitOnMobile?: boolean;
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-text-muted">No projects yet.</p>;
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`group flex min-h-52 min-w-0 flex-col justify-between rounded-lg border border-border bg-surface/95 p-5 transition-colors hover:bg-surface-hover sm:min-h-56 ${
              limitOnMobile && index > 0 ? "hidden sm:flex" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-wide text-text-subtle">
                <time>{project.date}</time>
                {project.githubUrl ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>Repository</span>
                  </>
                ) : null}
              </div>

              <h3 className="hyphens-auto break-words font-serif text-xl font-bold leading-tight text-text-main group-hover:underline">
                {project.title}
              </h3>

              {project.excerpt ? (
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-text-muted">
                  {project.excerpt}
                </p>
              ) : null}
            </div>

            <span className="mt-6 text-sm font-semibold text-text-subtle transition-colors group-hover:text-text-main">
              Open -&gt;
            </span>
          </Link>
        ))}
      </div>

      {limitOnMobile && projects.length > 1 ? (
        <div className="mt-4 sm:hidden">
          <Link
            href="/projects"
            className="text-sm text-text-main underline underline-offset-4 hover:opacity-80"
          >
            View all projects
          </Link>
        </div>
      ) : null}
    </>
  );
}
