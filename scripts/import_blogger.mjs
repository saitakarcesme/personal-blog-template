import fs from "fs";
import path from "path";
import TurndownService from "turndown";

const turndownService = new TurndownService();

const BLOGS = [
    "https://thelibraryofisa.blogspot.com/feeds/posts/default?alt=json&max-results=50",
    "https://theisanetwork.blogspot.com/feeds/posts/default?alt=json&max-results=50"
];

const OUTPUT_DIR = path.join(process.cwd(), "data", "posts");

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

async function fetchPosts(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.feed.entry || [];
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return [];
    }
}

async function importBlogger() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const blogUrl of BLOGS) {
        console.log(`Fetching from ${blogUrl}...`);
        const entries = await fetchPosts(blogUrl);

        for (const entry of entries) {
            const title = entry.title.$t;
            const htmlContent = entry.content.$t;
            const published = entry.published.$t.split("T")[0]; // YYYY-MM-DD
            const author = "ISA";

            const slug = slugify(title);
            const markdownBody = turndownService.turndown(htmlContent);

            const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${published}"
author: "${author}"
---
`;

            const fileContent = frontmatter + "\n" + markdownBody;
            const filePath = path.join(OUTPUT_DIR, `${slug}.md`);

            fs.writeFileSync(filePath, fileContent, "utf8");
            console.log(`Imported: ${title} -> ${slug}.md`);
        }
    }
}

importBlogger().catch(console.error);
