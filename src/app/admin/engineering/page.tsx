import Link from "next/link";
import {
  FiCpu,
  FiGrid,
  FiPackage,
  FiClipboard,
  FiActivity,
  FiCompass,
  FiBookOpen,
} from "react-icons/fi";
import {
  getEngineeringContent,
  getAllEngineeringItems,
} from "@/lib/engineering";

export default function AdminEngineeringHub() {
  const content = getEngineeringContent();
  const items = getAllEngineeringItems();

  const sections: Array<{
    href: string;
    icon: React.ReactNode;
    title: string;
    count: number | string;
    sub: string;
  }> = [
    {
      href: "/admin/engineering/hero",
      icon: <FiBookOpen />,
      title: "Hero",
      count: "1",
      sub: "Label, title, subtitle",
    },
    {
      href: "/admin/engineering/categories",
      icon: <FiGrid />,
      title: "Categories",
      count: content.categories.length,
      sub: "Setup categories shown as cards",
    },
    {
      href: "/admin/engineering/items",
      icon: <FiPackage />,
      title: "Items",
      count: items.length,
      sub: "Devices, tools, local models, anything",
    },
    {
      href: "/admin/engineering/workflow",
      icon: <FiActivity />,
      title: "Workflow",
      count: content.workflow.length,
      sub: "Timeline steps",
    },
    {
      href: "/admin/engineering/log",
      icon: <FiClipboard />,
      title: "Log",
      count: content.log.length,
      sub: "Short technical updates",
    },
    {
      href: "/admin/engineering/experiments",
      icon: <FiCompass />,
      title: "Experiments",
      count: content.experiments.length,
      sub: "Ideas in flight",
    },
    {
      href: "/admin/engineering/principles",
      icon: <FiCpu />,
      title: "Principles",
      count: content.principles.length,
      sub: "Short personal rules",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl pt-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-text-main">
          Manage Engineering
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Everything on the public Engineering page is edited from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-indigo/40 hover:bg-surface-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-indigo/10 text-accent-indigo">
              {section.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-lg font-bold text-text-main">
                  {section.title}
                </h2>
                <span className="text-xs text-text-subtle">{section.count}</span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{section.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
