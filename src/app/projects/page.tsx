import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { ProjectList } from "@/components/ProjectList";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageShell width="wide" wallpaper="projects">
      <PageHeader
        eyebrow="Projects"
        title="All projects"
        description="A focused index of the software projects and experiments I have been building."
      />
      <ProjectList projects={projects} />
    </PageShell>
  );
}
