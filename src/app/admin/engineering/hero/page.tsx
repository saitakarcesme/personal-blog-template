import { EngineeringHeroForm } from "@/components/EngineeringHeroForm";
import { getEngineeringContent } from "@/lib/engineering";

export default function AdminEngineeringHeroPage() {
  const { hero } = getEngineeringContent();
  return (
    <div className="mx-auto max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-text-main">
          Engineering Hero
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Top label, title, and subtitle shown on the Engineering page.
        </p>
      </div>
      <EngineeringHeroForm initial={hero} />
    </div>
  );
}
