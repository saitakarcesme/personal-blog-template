import { EngineeringItemForm } from "@/components/EngineeringItemForm";
import {
  getEngineeringContent,
  getEngineeringItemBySlug,
} from "@/lib/engineering";

export default async function AdminEditEngineeringItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEngineeringItemBySlug(slug);
  const { categories } = getEngineeringContent();

  if (!item) {
    return <div className="mt-10 text-center">Engineering item not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text-main">
          Edit: {item.title}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Update fields and save.
        </p>
      </div>
      <EngineeringItemForm
        mode="edit"
        categories={categories.map((c) => ({ slug: c.slug, title: c.title }))}
        initial={{
          slug: item.slug,
          title: item.title,
          category: item.category,
          shortDescription: item.shortDescription,
          fullDescription: item.content,
          useCase: item.useCase,
          status: item.status || "Active",
          specs: item.specs,
          imageUrl: item.imageUrl,
          featured: item.featured,
          order: item.order,
          visible: item.visible,
          createdAt: item.createdAt,
        }}
      />
    </div>
  );
}
