"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRadioEntry } from "@/actions/adminActions";
import { FiTrash2 } from "react-icons/fi";

export function RadioDeleteButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Delete "${title}" from Radio?`)) return;

    startTransition(async () => {
      await deleteRadioEntry(slug);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
      aria-label={`Delete ${title}`}
    >
      <FiTrash2 />
    </button>
  );
}
