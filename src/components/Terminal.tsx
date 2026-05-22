"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = { title: string; slug: string };

type Line = { text: string; tone?: "default" | "muted" | "error" | "accent" };

const PROMPT = "visitor@isa:~$";

const SECTION_ROUTES: Record<string, string> = {
  blog: "/blog",
  projects: "/projects",
  cinema: "/cinema",
  radio: "/radio",
  podcast: "/podcast",
  engineering: "/engineering",
  profile: "/profile",
};

const SECTIONS = Object.keys(SECTION_ROUTES);

const WELCOME: Line[] = [
  { text: "Welcome to ISA terminal.", tone: "accent" },
  { text: "Type 'help' for available commands.", tone: "muted" },
  { text: "" },
];

const HELP: Line[] = [
  { text: "Available commands:", tone: "accent" },
  { text: "  help          Show this help message" },
  { text: "  ls            List the main sections of the site" },
  { text: "  ls blog       List all blog posts by title" },
  { text: "  ls projects   List all projects" },
  { text: "  cd <section>  Open a section (e.g. cd blog)" },
  { text: "  cd ..         Go back to home" },
  { text: "  whoami        A short bio" },
  { text: "  clear         Clear the screen" },
  { text: "" },
];

const WHOAMI: Line[] = [
  { text: "Ibrahim Sait Akarcesme", tone: "accent" },
  { text: "Computer Science student." },
  {
    text: "Passionate about building software, exploring new technologies,",
  },
  { text: "and sharing thoughts here." },
  { text: "" },
];

export function Terminal({
  posts,
  projects,
}: {
  posts: Item[];
  projects: Item[];
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = useCallback(
    (raw: string): { output: Line[]; navigateTo?: string } => {
      const trimmed = raw.trim();
      if (!trimmed) return { output: [] };

      const [cmd, ...args] = trimmed.split(/\s+/);
      const arg = args[0];

      switch (cmd) {
        case "help":
          return { output: HELP };

        case "whoami":
          return { output: WHOAMI };

        case "clear":
          return { output: [] };

        case "ls": {
          if (!arg) {
            return {
              output: [
                ...SECTIONS.map((s) => ({ text: s, tone: "accent" as const })),
                { text: "" },
              ],
            };
          }
          if (arg === "blog") {
            if (posts.length === 0)
              return { output: [{ text: "No posts yet.", tone: "muted" }, { text: "" }] };
            return {
              output: [
                ...posts.map((p) => ({ text: p.title })),
                { text: "" },
                {
                  text: `${posts.length} post${posts.length === 1 ? "" : "s"}. Use 'cd blog' to browse.`,
                  tone: "muted" as const,
                },
                { text: "" },
              ],
            };
          }
          if (arg === "projects") {
            if (projects.length === 0)
              return { output: [{ text: "No projects yet.", tone: "muted" }, { text: "" }] };
            return {
              output: [
                ...projects.map((p) => ({ text: p.title })),
                { text: "" },
                {
                  text: `${projects.length} project${projects.length === 1 ? "" : "s"}. Use 'cd projects' to browse.`,
                  tone: "muted" as const,
                },
                { text: "" },
              ],
            };
          }
          if (SECTIONS.includes(arg)) {
            return {
              output: [
                { text: `Use 'cd ${arg}' to open this section.`, tone: "muted" },
                { text: "" },
              ],
            };
          }
          return {
            output: [
              { text: `ls: cannot access '${arg}': No such section`, tone: "error" },
              { text: "" },
            ],
          };
        }

        case "cd": {
          if (!arg) {
            return {
              output: [{ text: "cd: missing section. Try 'cd blog'.", tone: "error" }, { text: "" }],
            };
          }
          if (arg === ".." || arg === "~" || arg === "/") {
            return { output: [{ text: "Navigating to home…", tone: "muted" }], navigateTo: "/" };
          }
          const route = SECTION_ROUTES[arg];
          if (route) {
            return {
              output: [{ text: `Navigating to ${route}…`, tone: "muted" }],
              navigateTo: route,
            };
          }
          return {
            output: [
              { text: `cd: no such section: ${arg}`, tone: "error" },
              { text: "" },
            ],
          };
        }

        default:
          return {
            output: [
              {
                text: `command not found: ${cmd}. Type 'help' for available commands.`,
                tone: "error",
              },
              { text: "" },
            ],
          };
      }
    },
    [posts, projects],
  );

  const submit = useCallback(() => {
    const raw = input;
    const echo: Line = { text: `${PROMPT} ${raw}` };

    if (raw.trim()) {
      setHistory((h) => [...h, raw]);
    }
    setHistoryIndex(null);
    setInput("");

    if (raw.trim() === "clear") {
      setLines([]);
      return;
    }

    const { output, navigateTo } = run(raw);
    setLines((prev) => [...prev, echo, ...output]);

    if (navigateTo) {
      router.push(navigateTo);
    }
  }, [input, run, router]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <>
      {/* Mobile notice */}
      <div className="flex min-h-[100dvh] items-center justify-center bg-black px-6 text-center font-mono text-sm text-green-400 md:hidden">
        Terminal is best experienced on desktop.
      </div>

      {/* Terminal */}
      <div
        onClick={focusInput}
        className="hidden min-h-[100dvh] cursor-text bg-black font-mono text-sm leading-relaxed text-green-400 selection:bg-green-400/30 md:block"
      >
        <div
          ref={scrollRef}
          className="mx-auto h-[100dvh] max-w-4xl overflow-y-auto px-4 py-6 sm:px-6"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words ${
                line.tone === "muted"
                  ? "text-green-400/50"
                  : line.tone === "error"
                    ? "text-red-400"
                    : line.tone === "accent"
                      ? "text-green-300"
                      : "text-green-400"
              }`}
            >
              {line.text || " "}
            </div>
          ))}

          <div className="flex items-center">
            <span className="shrink-0 text-green-300">{PROMPT}&nbsp;</span>
            <span className="whitespace-pre-wrap break-words">{input}</span>
            <span className="terminal-cursor" aria-hidden="true">
              ▋
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input"
              className="absolute h-px w-px opacity-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
