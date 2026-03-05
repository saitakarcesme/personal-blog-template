import { BackButton } from "@/components/BackButton";
import { ProjectList } from "@/components/ProjectList";
import { Column } from "@/components/Column";

export default function ProjectsPage() {
    return (
        <div className="min-h-dvh text-foreground">
            <main className="mx-auto max-w-3xl px-4 pt-24 pb-10 min-[1300px]:py-10 sm:px-6 lg:px-8">
                <BackButton />
                <header className="mt-8 mb-8">
                    <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                        All Projects
                    </h1>
                </header>
                <Column className="min-h-0">
                    <ProjectList />
                </Column>
            </main>
        </div>
    );
}
