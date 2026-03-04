export type Project = {
    title: string;
    /** Full GitHub repository URL. */
    githubUrl: string;
};

/**
 * Add new projects here.
 * The homepage will automatically render them.
 */
export const projects: Project[] = [
    {
        title: "Password Manager Basic",
        githubUrl: "https://github.com/saitakarcesme/PasswordManagerBasic",
    },
    {
        title: "Monkey Typer",
        githubUrl: "https://github.com/saitakarcesme/MonkeyTyper",
    },
    {
        title: "Calculator Pro Polish",
        githubUrl: "https://github.com/saitakarcesme/CalculatorProPolish",
    },
    {
        title: "Edulux Website",
        githubUrl: "https://github.com/saitakarcesme/edulux-website",
    },
    {
        title: "My Personal Website",
        githubUrl: "https://github.com/saitakarcesme/MyPersonalWEBSITE",
    },

];
