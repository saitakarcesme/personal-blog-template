import { EngineeringItemForm } from "@/components/EngineeringItemForm";
import { getEngineeringContent } from "@/lib/engineering";

export default function AdminNewEngineeringItemPage() {
  const { categories } = getEngineeringContent();

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text-main">
          New Engineering Item
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Add a device, tool, or model. Sits under a category.
        </p>
      </div>
      <EngineeringItemForm
        mode="create"
        categories={categories.map((c) => ({ slug: c.slug, title: c.title }))}
      />
    </div>
  );
}
