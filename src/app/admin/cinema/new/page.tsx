import { CinemaForm } from "@/components/CinemaForm";
import { FiStar } from "react-icons/fi";

export default function NewCinemaPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
          <FiStar />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            New Cinema Entry
          </h1>
          <p className="text-sm text-text-muted">
            Look up a movie or TV show, then save your personal score.
          </p>
        </div>
      </div>

      <CinemaForm mode="create" />
    </div>
  );
}
