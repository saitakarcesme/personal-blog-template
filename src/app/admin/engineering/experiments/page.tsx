import { EngineeringListForm } from "@/components/EngineeringListForm";
import { saveEngineeringExperiments } from "@/actions/adminActions";
import { EXPERIMENT_STATUSES, getEngineeringContent } from "@/lib/engineering";

export default function AdminEngineeringExperimentsPage() {
  const { experiments } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <EngineeringListForm
        title="Experiments"
        description="Ideas you're testing or want to build."
        prefix="experiment"
        action={saveEngineeringExperiments}
        rowTitleField="title"
        fields={[
          { name: "title", type: "text", label: "Title", required: true },
          { name: "slug", type: "text", label: "Slug" },
          { name: "status", type: "select", label: "Status", options: [...EXPERIMENT_STATUSES] },
          { name: "relatedLink", type: "url", label: "Related link (optional)", placeholder: "https://..." },
          { name: "description", type: "textarea", label: "Description" },
        ]}
        initial={experiments.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          status: e.status,
          relatedLink: e.relatedLink,
          description: e.description,
          order: e.order,
          visible: e.visible,
        }))}
        rowDefaults={{
          title: "",
          slug: "",
          status: "Planned",
          relatedLink: "",
          description: "",
          order: 1000,
          visible: true,
        }}
      />
    </div>
  );
}
