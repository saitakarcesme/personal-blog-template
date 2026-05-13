import { EngineeringListForm } from "@/components/EngineeringListForm";
import { saveEngineeringPrinciples } from "@/actions/adminActions";
import { getEngineeringContent } from "@/lib/engineering";

export default function AdminEngineeringPrinciplesPage() {
  const { principles } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <EngineeringListForm
        title="Principles"
        description="Short personal engineering rules."
        prefix="principle"
        action={saveEngineeringPrinciples}
        rowTitleField="text"
        fields={[
          { name: "text", type: "text", label: "Principle", required: true, placeholder: "Ship fast, then clean." },
        ]}
        initial={principles.map((p) => ({
          id: p.id,
          text: p.text,
          order: p.order,
          visible: p.visible,
        }))}
        rowDefaults={{ text: "", order: 1000, visible: true }}
      />
    </div>
  );
}
