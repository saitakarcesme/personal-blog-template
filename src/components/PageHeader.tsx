export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <header className={`mb-8 ${centered ? "text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase text-text-subtle">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-text-main sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 text-text-muted ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
