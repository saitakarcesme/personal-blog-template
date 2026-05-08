"use server";

import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
}

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

function quoted(value: string) {
    return JSON.stringify(value);
}

function clampIsaScore(value: FormDataEntryValue | null) {
    const score = Number(value);
    if (!Number.isFinite(score)) return 0;
    return Math.min(100, Math.max(0, Math.round(score)));
}

function normalizeCinemaType(value: FormDataEntryValue | null) {
    return value === "tv" ? "tv" : "movie";
}

function normalizeRadioType(value: FormDataEntryValue | null) {
    if (value === "album" || value === "playlist") return value;
    return "song";
}

function buildCinemaMarkdown(formData: FormData, createdAt?: string) {
    const title = String(formData.get("title") || "").trim();
    const year = String(formData.get("year") || "").trim();
    const type = normalizeCinemaType(formData.get("type"));
    const poster = String(formData.get("poster") || "").trim();
    const imdbId = String(formData.get("imdbId") || "").trim();
    const imdbRating = String(formData.get("imdbRating") || "N/A").trim() || "N/A";
    const isaScore = clampIsaScore(formData.get("isaScore"));
    const watchedDate = String(formData.get("watchedDate") || "").trim();
    const review = String(formData.get("review") || "").trim();
    const requestedSlug = String(formData.get("slug") || "").trim();
    const slug = slugify(requestedSlug || title);
    const now = new Date().toISOString();

    if (!title || !slug || !review) {
        throw new Error("Title, slug, and review are required.");
    }

    const fileContent = `---
title: ${quoted(title)}
slug: ${quoted(slug)}
year: ${quoted(year)}
type: ${quoted(type)}
poster: ${quoted(poster)}
imdbId: ${quoted(imdbId)}
imdbRating: ${quoted(imdbRating)}
isaScore: ${isaScore}
watchedDate: ${quoted(watchedDate)}
createdAt: ${quoted(createdAt || now)}
updatedAt: ${quoted(now)}
---

${review}
`;

    return { slug, fileContent };
}

function buildRadioMarkdown(formData: FormData, createdAt?: string) {
    const title = String(formData.get("title") || "").trim();
    const artist = String(formData.get("artist") || "").trim();
    const year = String(formData.get("year") || "").trim();
    const type = normalizeRadioType(formData.get("type"));
    const cover = String(formData.get("cover") || "").trim();
    const sourceId = String(formData.get("sourceId") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();
    const isaScore = clampIsaScore(formData.get("isaScore"));
    const mood = String(formData.get("mood") || "").trim();
    const listenedDate = String(formData.get("listenedDate") || "").trim();
    const review = String(formData.get("review") || "").trim();
    const requestedSlug = String(formData.get("slug") || "").trim();
    const slug = slugify(requestedSlug || `${title} ${artist}`);
    const now = new Date().toISOString();

    if (!title || !slug || !review) {
        throw new Error("Title, slug, and review are required.");
    }

    const fileContent = `---
title: ${quoted(title)}
slug: ${quoted(slug)}
artist: ${quoted(artist)}
year: ${quoted(year)}
type: ${quoted(type)}
cover: ${quoted(cover)}
sourceId: ${quoted(sourceId)}
sourceUrl: ${quoted(sourceUrl)}
isaScore: ${isaScore}
mood: ${quoted(mood)}
listenedDate: ${quoted(listenedDate)}
createdAt: ${quoted(createdAt || now)}
updatedAt: ${quoted(now)}
---

${review}
`;

    return { slug, fileContent };
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
        } catch (commitErr: unknown) {
            // Ignore if working tree is clean
            if (!getErrorMessage(commitErr).includes("nothing to commit")) {
                throw commitErr;
            }
        }

        await execAsync('git push origin main');
        return { success: true, message: "Successfully published to GitHub! Vercel redeployment triggered." };
    } catch (error: unknown) {
        console.error("Failed to publish changes via git:", error);
        return { success: false, message: getErrorMessage(error) || "Unknown error during git push." };
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

    // 50MB for both images and videos
    const maxSize = 50 * 1024 * 1024;
    if (size > maxSize) {
        throw new Error(`File too large. Max size is 50MB.`);
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

export async function saveCinemaEntry(formData: FormData) {
    requireDevelopment();

    const cinemaDir = path.join(process.cwd(), "data", "cinema");
    if (!fs.existsSync(cinemaDir)) {
        fs.mkdirSync(cinemaDir, { recursive: true });
    }

    const { slug, fileContent } = buildCinemaMarkdown(formData);
    fs.writeFileSync(path.join(cinemaDir, `${slug}.md`), fileContent, "utf8");

    return { success: true, slug };
}

export async function updateCinemaEntry(originalSlug: string, formData: FormData) {
    requireDevelopment();

    const cinemaDir = path.join(process.cwd(), "data", "cinema");
    if (!fs.existsSync(cinemaDir)) {
        fs.mkdirSync(cinemaDir, { recursive: true });
    }

    const createdAt = String(formData.get("createdAt") || "").trim() || undefined;
    const { slug, fileContent } = buildCinemaMarkdown(formData, createdAt);

    if (originalSlug !== slug) {
        const originalPath = path.join(cinemaDir, `${originalSlug}.md`);
        if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
        }
    }

    fs.writeFileSync(path.join(cinemaDir, `${slug}.md`), fileContent, "utf8");

    return { success: true, slug };
}

export async function deleteCinemaEntry(slug: string) {
    requireDevelopment();

    const safeSlug = slugify(slug);
    const filePath = path.join(process.cwd(), "data", "cinema", `${safeSlug}.md`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return { success: true };
}

export async function saveRadioEntry(formData: FormData) {
    requireDevelopment();

    const radioDir = path.join(process.cwd(), "data", "radio");
    if (!fs.existsSync(radioDir)) {
        fs.mkdirSync(radioDir, { recursive: true });
    }

    const { slug, fileContent } = buildRadioMarkdown(formData);
    fs.writeFileSync(path.join(radioDir, `${slug}.md`), fileContent, "utf8");

    return { success: true, slug };
}

export async function updateRadioEntry(originalSlug: string, formData: FormData) {
    requireDevelopment();

    const radioDir = path.join(process.cwd(), "data", "radio");
    if (!fs.existsSync(radioDir)) {
        fs.mkdirSync(radioDir, { recursive: true });
    }

    const createdAt = String(formData.get("createdAt") || "").trim() || undefined;
    const { slug, fileContent } = buildRadioMarkdown(formData, createdAt);

    if (originalSlug !== slug) {
        const originalPath = path.join(radioDir, `${originalSlug}.md`);
        if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
        }
    }

    fs.writeFileSync(path.join(radioDir, `${slug}.md`), fileContent, "utf8");

    return { success: true, slug };
}

export async function deleteRadioEntry(slug: string) {
    requireDevelopment();

    const safeSlug = slugify(slug);
    const filePath = path.join(process.cwd(), "data", "radio", `${safeSlug}.md`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return { success: true };
}

export async function saveAlbumPhoto(formData: FormData) {
    requireDevelopment();

    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    if (!date || !file) {
        throw new Error("Date and File are required.");
    }

    // Ensure we have uploadMedia defined and it works
    const uploadResult = await uploadMedia(formData);
    if (!uploadResult.success) {
        throw new Error("Media upload failed.");
    }

    const albumFile = path.join(process.cwd(), "data", "album.ts");
    
    if (!fs.existsSync(albumFile)) {
        throw new Error("album.ts not found");
    }

    const content = fs.readFileSync(albumFile, "utf8");
    const id = Date.now().toString();

    const newObjStr = `  {
    id: "${id}",
    url: "${uploadResult.url}",
    date: "${date}",
    description: "${description ? description.replace(/"/g, '\\"') : ""}",
  },
];`;

    const updatedContent = content.replace(/];/, newObjStr);
    
    fs.writeFileSync(albumFile, updatedContent, "utf8");
    return { success: true };
}

export async function saveAlbumPhotos(formData: FormData) {
    requireDevelopment();

    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("files") as File[];

    if (!date || !files || files.length === 0) {
        throw new Error("Date and at least one file are required.");
    }

    const albumFile = path.join(process.cwd(), "data", "album.ts");

    if (!fs.existsSync(albumFile)) {
        throw new Error("album.ts not found");
    }

    const results: { id: string; url: string }[] = [];

    for (const file of files) {
        // Create a new FormData for each file to reuse uploadMedia
        const singleFormData = new FormData();
        singleFormData.set("file", file);

        const uploadResult = await uploadMedia(singleFormData);
        if (!uploadResult.success) {
            throw new Error(`Failed to upload: ${file.name}`);
        }

        const id = (Date.now() + results.length).toString();
        results.push({ id, url: uploadResult.url });
    }

    // Build all new entries and append them in one write
    const content = fs.readFileSync(albumFile, "utf8");
    const newEntries = results.map((r) => `  {
    id: "${r.id}",
    url: "${r.url}",
    date: "${date}",
    description: "${description ? description.replace(/"/g, '\\"') : ""}",
  },`).join("\n");

    const updatedContent = content.replace(/];/, newEntries + "\n];");
    fs.writeFileSync(albumFile, updatedContent, "utf8");

    return { success: true, count: results.length };
}

export async function deleteAlbumPhoto(id: string) {
    requireDevelopment();

    const albumFile = path.join(process.cwd(), "data", "album.ts");

    if (!fs.existsSync(albumFile)) {
        throw new Error("album.ts not found");
    }

    const content = fs.readFileSync(albumFile, "utf8");

    // Find the photo entry to get the url for file deletion
    const urlMatch = content.match(new RegExp(`\\{[^}]*id:\\s*"${id}"[^}]*url:\\s*"([^"]*)"[^}]*\\}`));
    if (urlMatch && urlMatch[1]) {
        const mediaPath = path.join(process.cwd(), "public", urlMatch[1]);
        if (fs.existsSync(mediaPath)) {
            fs.unlinkSync(mediaPath);
        }
    }

    // Remove the entry from the array - match the entire object block for this id
    const entryRegex = new RegExp(`\\s*\\{[^}]*id:\\s*"${id}"[^}]*\\},?`, "g");
    const updatedContent = content.replace(entryRegex, "");

    fs.writeFileSync(albumFile, updatedContent, "utf8");
    return { success: true };
}

export async function getAlbumPhotos() {
    requireDevelopment();

    const albumFile = path.join(process.cwd(), "data", "album.ts");

    if (!fs.existsSync(albumFile)) {
        return [];
    }

    const content = fs.readFileSync(albumFile, "utf8");

    // Parse photos from the file content
    const photoRegex = /\{\s*id:\s*"([^"]*)",\s*url:\s*"([^"]*)",\s*date:\s*"([^"]*)",\s*description:\s*"([^"]*)"\s*,?\s*\}/g;
    const photos: { id: string; url: string; date: string; description: string }[] = [];
    let match;

    while ((match = photoRegex.exec(content)) !== null) {
        photos.push({
            id: match[1],
            url: match[2],
            date: match[3],
            description: match[4],
        });
    }

    return photos;
}
