"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

export type FieldDef =
  | { name: string; type: "text" | "textarea" | "url"; label: string; placeholder?: string; required?: boolean }
  | { name: string; type: "select"; label: string; options: string[]; required?: boolean };

export type ListRow = {
  id: string;
  [key: string]: string | number | boolean | undefined;
};

type Props = {
  title: string;
  description?: string;
  prefix: string; // form field prefix (e.g. "workflow")
  fields: FieldDef[];
  initial: ListRow[];
  action: (formData: FormData) => Promise<{ success: boolean }>;
  rowDefaults: Omit<ListRow, "id">;
  rowTitleField?: string; // shown as the row header
};

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function EngineeringListForm({
  title,
  description,
  prefix,
  fields,
  initial,
  action,
  rowDefaults,
  rowTitleField = "title",
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<ListRow[]>(() => {
    // ensure each row has an id
    return initial.map((r) => ({
      ...r,
      id: typeof r.id === "string" && r.id ? r.id : genId(prefix),
    }));
  });
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  function update(index: number, key: string, value: string | boolean | number) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { ...rowDefaults, id: genId(prefix), order: (prev.length + 1) * 10 },
    ]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function moveRow(index: number, dir: -1 | 1) {
    setRows((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      // renumber order
      return next.map((r, i) => ({ ...r, order: (i + 1) * 10 }));
    });
  }

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      try {
        await action(formData);
        setFeedback({ kind: "ok", msg: "Saved." });
        router.refresh();
      } catch (e) {
        setFeedback({
          kind: "err",
          msg: e instanceof Error ? e.message : "Failed to save.",
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-main">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-main hover:bg-surface-hover"
        >
          <FiPlus /> Add row
        </button>
      </div>

      <input type="hidden" name={`${prefix}__count`} value={rows.length} />

      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-text-muted">
            No entries yet. Click <span className="text-text-main">Add row</span> to start.
          </p>
        ) : null}

        {rows.map((row, index) => {
          const titleValue = String(row[rowTitleField] ?? "") || `Row ${index + 1}`;
          return (
            <div
              key={String(row.id)}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-text-subtle">
                    {index + 1}.
                  </p>
                  <p className="truncate font-serif text-base font-bold text-text-main">
                    {titleValue}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveRow(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRow(index, 1)}
                    disabled={index === rows.length - 1}
                    className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <FiArrowDown />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    aria-label="Delete row"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <input
                type="hidden"
                name={`${prefix}__${index}__id`}
                value={String(row.id)}
              />
              <input
                type="hidden"
                name={`${prefix}__${index}__order`}
                value={String(row.order ?? (index + 1) * 10)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => {
                  const value = row[field.name];
                  const inputId = `${prefix}-${index}-${field.name}`;
                  const baseClass =
                    "rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-main outline-none focus:border-accent-indigo/60";

                  if (field.type === "textarea") {
                    return (
                      <label
                        key={field.name}
                        htmlFor={inputId}
                        className="grid gap-2 text-sm text-text-muted sm:col-span-2"
                      >
                        {field.label}
                        <textarea
                          id={inputId}
                          name={`${prefix}__${index}__${field.name}`}
                          value={String(value ?? "")}
                          onChange={(e) => update(index, field.name, e.target.value)}
                          rows={3}
                          required={field.required}
                          placeholder={field.placeholder}
                          className={`${baseClass} resize-y leading-6`}
                        />
                      </label>
                    );
                  }

                  if (field.type === "select") {
                    return (
                      <label
                        key={field.name}
                        htmlFor={inputId}
                        className="grid gap-2 text-sm text-text-muted"
                      >
                        {field.label}
                        <select
                          id={inputId}
                          name={`${prefix}__${index}__${field.name}`}
                          value={String(value ?? field.options[0] ?? "")}
                          onChange={(e) => update(index, field.name, e.target.value)}
                          required={field.required}
                          className={baseClass}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }

                  return (
                    <label
                      key={field.name}
                      htmlFor={inputId}
                      className="grid gap-2 text-sm text-text-muted"
                    >
                      {field.label}
                      <input
                        id={inputId}
                        name={`${prefix}__${index}__${field.name}`}
                        type={field.type === "url" ? "url" : "text"}
                        value={String(value ?? "")}
                        onChange={(e) => update(index, field.name, e.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={baseClass}
                      />
                    </label>
                  );
                })}

                <label className="flex items-center gap-2 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    name={`${prefix}__${index}__visible`}
                    value="true"
                    defaultChecked={row.visible !== false}
                    className="h-4 w-4 accent-[#6366f1]"
                  />
                  Visible on public page
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        {feedback ? (
          <p
            className={`text-sm ${
              feedback.kind === "ok" ? "text-accent-indigo" : "text-red-400"
            }`}
          >
            {feedback.msg}
          </p>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
