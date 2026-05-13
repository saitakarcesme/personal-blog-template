import { EngineeringListForm } from "@/components/EngineeringListForm";
import { saveEngineeringLog } from "@/actions/adminActions";
import { getEngineeringContent, LOG_STATUSES } from "@/lib/engineering";

export default function AdminEngineeringLogPage() {
  const { log } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <EngineeringListForm
        title="Engineering log"
        description="Short technical updates. Not full blog posts."
        prefix="log"
        action={saveEngineeringLog}
        rowTitleField="title"
        fields={[
          { name: "title", type: "text", label: "Title", required: true },
          { name: "status", type: "select", label: "Status", options: [...LOG_STATUSES] },
          { name: "dateLabel", type: "text", label: "Date / label (optional)", placeholder: "May 2026" },
          { name: "description", type: "textarea", label: "Description" },
        ]}
        initial={log.map((l) => ({
          id: l.id,
          title: l.title,
          status: l.status,
          dateLabel: l.dateLabel,
          description: l.description,
          order: l.order,
          visible: l.visible,
        }))}
        rowDefaults={{
          title: "",
          status: "Ongoing",
          dateLabel: "",
          description: "",
          order: 1000,
          visible: true,
        }}
      />
    </div>
  );
}
