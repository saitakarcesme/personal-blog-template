"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  saveEngineeringItem,
  updateEngineeringItem,
} from "@/actions/adminActions";

type Mode = "create" | "edit";

type Spec = { key: string; value: string };

export type ItemFormData = {
  slug?: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  useCase: string;
  status: string;
  specs: Spec[];
  imageUrl: string;
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: string;
};

const STATUSES = ["Active", "Testing", "Archived", "Planned", "Occasional"];

const defaultData: ItemFormData = {
  title: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  useCase: "",
  status: "Active",
  specs: [],
  imageUrl: "",
  featured: false,
  order: 100,
  visible: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function EngineeringItemForm({
  mode = "create",
  initial,
  categories,
}: {
  mode?: Mode;
  initial?: ItemFormData;
  categories: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const data = initial ?? defaultData;
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(data.title);
  const [slug, setSlug] = useState(data.slug ?? slugify(data.title));
  const [slugTouched, setSlugTouched] = useState(Boolean(data.slug));
  const [category, setCategory] = useState(data.category || categories[0]?.slug || "");
  const [shortDescription, setShortDescription] = useState(data.shortDescription);
  const [fullDescription, setFullDescription] = useState(data.fullDescription);
  const [useCase, setUseCase] = useState(data.useCase);
  const [status, setStatus] = useState(data.status || "Active");
  const [specs, setSpecs] = useState<Spec[]>(data.specs ?? []);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [featured, setFeatured] = useState(data.featured);
  const [order, setOrder] = useState<number>(data.order ?? 100);
  const [visible, setVisible] = useState(data.visible !== false);
  const [formError, setFormError] = useState("");

  function handleSubmit(formData: FormData) {
    setFormError("");
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && initial?.slug
            ? await updateEngineeringItem(initial.slug, formData)
            : await saveEngineeringItem(formData);
        router.push(`/admin/engineering/items/edit/${result.slug}`);
        router.refresh();
      } catch (e) {
        setFormError(
          e instanceof Error ? e.message : "Failed to save item.",
        );
      }
    });
  }

  const inputClass =
    "rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent-indigo/60";

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="createdAt" value={data.createdAt ?? ""} />
      <input type="hidden" name="specs__count" value={specs.length} />
      {specs.map((spec, i) => (
        <span key={`hidden-spec-${i}`}>
          <input type="hidden" name={`specs__${i}__key`} value={spec.key} />
          <input type="hidden" name={`specs__${i}__value`} value={spec.value} />
        </span>
      ))}

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-text-muted">
            Title
            <input
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
              className={inputClass}
              placeholder="MacBook Pro M-series"
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted">
            Slug
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
              className={inputClass}
              placeholder="macbook-pro"
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted">
            Category
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={inputClass}
            >
              {categories.length === 0 ? (
                <option value="">No categories yet</option>
              ) : (
                categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-text-muted">
            Status
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-text-muted">
            Use case
            <input
              name="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className={inputClass}
              placeholder="Daily development, Local LLM testing, Design..."
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted">
            Display order
            <input
              type="number"
              name="order"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted sm:col-span-2">
            Short description
            <input
              name="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputClass}
              placeholder="One line for cards."
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted sm:col-span-2">
            Full description
            <textarea
              name="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={10}
              className={`${inputClass} resize-y font-serif leading-7`}
              placeholder="Why you use it, pros / cons, how it fits the workflow. Markdown supported."
            />
          </label>

          <label className="grid gap-2 text-sm text-text-muted sm:col-span-2">
            Image URL (optional)
            <input
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://... or /media/..."
            />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="mt-2 aspect-[16/9] w-full max-w-md rounded-md border border-border object-cover"
              />
            ) : null}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-text-main">Specs</h2>
            <p className="text-xs text-text-subtle">Optional key/value pairs.</p>
          </div>
          <button
            type="button"
            onClick={() => setSpecs((prev) => [...prev, { key: "", value: "" }])}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-text-main hover:bg-surface-hover"
          >
            <FiPlus /> Add spec
          </button>
        </div>
        {specs.length === 0 ? (
          <p className="text-sm text-text-muted">No specs.</p>
        ) : (
          <div className="space-y-2">
            {specs.map((spec, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <input
                  value={spec.key}
                  onChange={(e) =>
                    setSpecs((prev) =>
                      prev.map((s, idx) => (idx === i ? { ...s, key: e.target.value } : s)),
                    )
                  }
                  placeholder="GPU"
                  className={inputClass}
                />
                <input
                  value={spec.value}
                  onChange={(e) =>
                    setSpecs((prev) =>
                      prev.map((s, idx) => (idx === i ? { ...s, value: e.target.value } : s)),
                    )
                  }
                  placeholder="RTX 3090"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  aria-label="Remove spec"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              name="featured"
              value="true"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[#6366f1]"
            />
            Featured (shown on Engineering home)
          </label>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              name="visible"
              value="true"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 accent-[#6366f1]"
            />
            Visible on public page
          </label>
        </div>
      </section>

      {formError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-bold text-background shadow-md transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : mode === "edit"
              ? "Update item"
              : "Save item"}
        </button>
      </div>
    </form>
  );
}
