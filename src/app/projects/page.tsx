import { BackButton } from "@/components/BackButton";
import { ProjectList } from "@/components/ProjectList";
import { Column } from "@/components/Column";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
    const projects = getAllProjects();

    return (
        <div className="min-h-dvh text-foreground">
            <main className="mx-auto max-w-3xl px-4 pt-24 pb-10 min-[1300px]:py-10 sm:px-6 lg:px-8">
                <BackButton />
                <header className="mt-8 mb-12 text-center">
                    <h1 className="text-balance text-4xl font-bold tracking-tight text-text-main font-serif">
                        All Projects
                    </h1>
                </header>
                <Column className="min-h-0">
                    <ProjectList projects={projects} />
                </Column>
            </main>
        </div>
    );
}
