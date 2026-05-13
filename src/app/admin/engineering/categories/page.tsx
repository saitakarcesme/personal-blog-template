import { EngineeringListForm } from "@/components/EngineeringListForm";
import { saveEngineeringCategories } from "@/actions/adminActions";
import { getEngineeringContent } from "@/lib/engineering";

export default function AdminEngineeringCategoriesPage() {
  const { categories } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <EngineeringListForm
        title="Categories"
        description="Setup categories shown on the Engineering page. Each category becomes a clickable card and a /engineering/<slug> page."
        prefix="category"
        action={saveEngineeringCategories}
        rowTitleField="title"
        fields={[
          { name: "title", type: "text", label: "Title", required: true, placeholder: "Machine" },
          { name: "slug", type: "text", label: "Slug", placeholder: "machine" },
          { name: "description", type: "textarea", label: "Description" },
        ]}
        initial={categories.map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          description: c.description,
          order: c.order,
          visible: c.visible,
        }))}
        rowDefaults={{
          title: "",
          slug: "",
          description: "",
          order: 1000,
          visible: true,
        }}
      />
    </div>
  );
}
