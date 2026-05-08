import { RadioForm } from "@/components/RadioForm";
import { FiRadio } from "react-icons/fi";

export default function NewRadioPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
          <FiRadio />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            New Radio Entry
          </h1>
          <p className="text-sm text-text-muted">
            Search a song or album, then save your personal score.
          </p>
        </div>
      </div>

      <RadioForm mode="create" />
    </div>
  );
}
