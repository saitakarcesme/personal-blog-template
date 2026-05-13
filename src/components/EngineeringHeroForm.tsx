"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEngineeringHero } from "@/actions/adminActions";

type Hero = { label: string; title: string; subtitle: string };

export function EngineeringHeroForm({ initial }: { initial: Hero }) {
  const router = useRouter();
  const [label, setLabel] = useState(initial.label);
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      try {
        await updateEngineeringHero(formData);
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

  const inputClass =
    "rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent-indigo/60";

  return (
    <form
      action={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      <label className="grid gap-2 text-sm text-text-muted">
        Page label
        <input
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className={inputClass}
          placeholder="Engineering"
        />
      </label>
      <label className="grid gap-2 text-sm text-text-muted">
        Title
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="Engineering"
        />
      </label>
      <label className="grid gap-2 text-sm text-text-muted">
        Subtitle
        <textarea
          name="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={3}
          className={`${inputClass} resize-y leading-6`}
          placeholder="My setup, coding workflow, experiments, and technical notes."
        />
      </label>

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
