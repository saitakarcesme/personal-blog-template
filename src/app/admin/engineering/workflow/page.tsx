import { EngineeringListForm } from "@/components/EngineeringListForm";
import { saveEngineeringWorkflow } from "@/actions/adminActions";
import { getEngineeringContent } from "@/lib/engineering";

export default function AdminEngineeringWorkflowPage() {
  const { workflow } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <EngineeringListForm
        title="Workflow timeline"
        description="Steps that show how your coding flow has evolved."
        prefix="workflow"
        action={saveEngineeringWorkflow}
        rowTitleField="title"
        fields={[
          { name: "stepLabel", type: "text", label: "Step label", placeholder: "Step 01" },
          { name: "title", type: "text", label: "Title", required: true, placeholder: "Manual Coding" },
          { name: "description", type: "textarea", label: "Description" },
        ]}
        initial={workflow.map((s) => ({
          id: s.id,
          stepLabel: s.stepLabel,
          title: s.title,
          description: s.description,
          order: s.order,
          visible: s.visible,
        }))}
        rowDefaults={{
          stepLabel: "",
          title: "",
          description: "",
          order: 1000,
          visible: true,
        }}
      />
    </div>
  );
}
