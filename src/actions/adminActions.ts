"use server";

import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Helper to check environment security
function requireDevelopment() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Admin actions are completely disabled in production.");
    }
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")           // Replace spaces with -
        .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
        .replace(/\-\-+/g, "-")         // Replace multiple - with single -
        .trim();
}

export async function savePost(formData: FormData) {
    requireDevelopment();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const content = formData.get("content") as string;

    if (!title || !date || !content) {
        throw new Error("Title, date, and content are required.");
    }

    const slug = slugify(title);
    const fileName = `${slug}.md`;
    const postsDir = path.join(process.cwd(), "data", "posts");

    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
    }

    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
author: "${author || "ISA"}"
---

${content}
`;

    fs.writeFileSync(path.join(postsDir, fileName), fileContent, "utf8");
    return { success: true, slug };
}

export async function saveProject(formData: FormData) {
    requireDevelopment();

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const content = formData.get("content") as string;

    if (!title || !date || !githubUrl || !content) {
        throw new Error("Title, date, Github URL, and content are required.");
    }

    const slug = slugify(title);
    const fileName = `${slug}.md`;
    const projectsDir = path.join(process.cwd(), "data", "projects");

    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir, { recursive: true });
    }

    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
githubUrl: "${githubUrl}"
---

${content}
`;

    fs.writeFileSync(path.join(projectsDir, fileName), fileContent, "utf8");
    return { success: true, slug };
}

export async function publishChanges() {
    requireDevelopment();
    
    try {
        // Ensure we are explicitly running standard git adding, committing, and pushing logic
        await execAsync('git add data/');
        
        // This command might fail if there's nothing to commit, which is fine, we intercept the error and still try to push.
        try {
            await execAsync('git commit -m "Admin update: added new files"');
        } catch (commitErr: any) {
            // Ignore if working tree is clean
            if (!commitErr.message.includes("nothing to commit")) {
                throw commitErr;
            }
        }

        await execAsync('git push origin main');
        return { success: true, message: "Successfully published to GitHub! Vercel redeployment triggered." };
    } catch (error: any) {
        console.error("Failed to publish changes via git:", error);
        return { success: false, message: error.message || "Unknown error during git push." };
    }
}

export async function savePodcast(formData: FormData) {
    requireDevelopment();

    const title = formData.get("title") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const date = formData.get("date") as string;

    if (!title || !youtubeUrl || !date) {
        throw new Error("Title, YouTube URL, and Date are required.");
    }

    const podcastsFile = path.join(process.cwd(), "data", "podcasts.ts");
    
    if (!fs.existsSync(podcastsFile)) {
        throw new Error("podcasts.ts not found");
    }

    const content = fs.readFileSync(podcastsFile, "utf8");
    
    // Auto-calculate the next episode number by parsing existing ones
    let nextEpisodeNum = 1;
    const epMatches = content.match(/episode:\s*(\d+)/g);
    if (epMatches && epMatches.length > 0) {
        const numbers = epMatches.map(m => parseInt(m.replace("episode:", "").trim(), 10));
        nextEpisodeNum = Math.max(...numbers) + 1;
    }

    const newObjStr = `  {
    episode: ${nextEpisodeNum},
    title: "${title.replace(/"/g, '\\"')}",
    youtubeUrl: "${youtubeUrl}",
    date: "${date}",
  },
];`;

    // Replace the closing array bracket with the new object and a closing bracket
    const updatedContent = content.replace(/];/, newObjStr);
    
    fs.writeFileSync(podcastsFile, updatedContent, "utf8");
    return { success: true };
}

export async function uploadMedia(formData: FormData) {
    requireDevelopment();

    const file = formData.get("file") as File | null;
    if (!file) {
        throw new Error("No file uploaded.");
    }

    const type = file.type;
    const size = file.size;
    const isImage = type.startsWith("image/");
    const isVideo = type.startsWith("video/");

    if (!isImage && !isVideo) {
        throw new Error("Only images and videos are supported.");
    }

    // 5MB for images, 50MB for videos
    const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (size > maxSize) {
        throw new Error(`File too large. Max size is ${isImage ? '5MB' : '50MB'}.`);
    }

    const mediaDir = path.join(process.cwd(), "public", "media");
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Sanitize filename
    const sanitizedName = slugify(file.name.replace(/\.[^/.]+$/, "")) + path.extname(file.name).toLowerCase();
    const fileName = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(mediaDir, fileName);

    fs.writeFileSync(filePath, buffer);
    return { success: true, url: `/media/${fileName}`, type: isVideo ? 'video' : 'image' };
}

export async function updatePost(originalSlug: string, formData: FormData) {
    requireDevelopment();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const content = formData.get("content") as string;

    if (!title || !date || !content) {
        throw new Error("Title, date, and content are required.");
    }

    const newSlug = slugify(title);
    const postsDir = path.join(process.cwd(), "data", "posts");
    
    // If slug changed, delete original
    if (originalSlug !== newSlug) {
        const originalPath = path.join(postsDir, `${originalSlug}.md`);
        if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
        }
    }

    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
    }

    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
author: "${author || "ISA"}"
---

${content}
`;

    fs.writeFileSync(path.join(postsDir, `${newSlug}.md`), fileContent, "utf8");
    return { success: true, slug: newSlug };
}

export async function deletePost(slug: string) {
    requireDevelopment();
    const postsDir = path.join(process.cwd(), "data", "posts");
    const filePath = path.join(postsDir, `${slug}.md`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    return { success: true };
}
