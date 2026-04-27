"use client";

import { useTransition, useRef, useState } from "react";
import { savePost, updatePost, uploadMedia } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { FiImage, FiVideo, FiLoader } from "react-icons/fi";

export type PostData = {
    slug?: string;
    title: string;
    date: string;
    author: string;
    content: string;
};

export default function PostEditor({ initialData, mode = "create" }: { initialData?: PostData, mode?: "create" | "edit" }) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            if (mode === "edit" && initialData?.slug) {
                await updatePost(initialData.slug, formData);
            } else {
                await savePost(formData);
            }
            router.push("/admin");
        });
    };

    const insertTextAtCursor = (text: string) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;

        textarea.value = currentVal.substring(0, start) + text + currentVal.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            
            const result = await uploadMedia(formData);
            if (result.success) {
                if (result.type === "image") {
                    insertTextAtCursor(`\n![${file.name}](${result.url})\n`);
                } else if (result.type === "video") {
                    insertTextAtCursor(`\n<video controls src="${result.url}" class="w-full rounded-xl"></video>\n`);
                }
            }
        } catch (error: any) {
            alert(error.message || "Failed to upload file.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleEmbedVideo = () => {
        const url = prompt("Enter YouTube or Vimeo URL:");
        if (!url) return;

        let embedUrl = url;
        // Simple youtube conversion
        if (url.includes("youtube.com/watch?v=")) {
            embedUrl = url.replace("watch?v=", "embed/");
        } else if (url.includes("youtu.be/")) {
            embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
        }

        const embedCode = `\n<iframe src="${embedUrl}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full aspect-video rounded-xl"></iframe>\n`;
        insertTextAtCursor(embedCode);
    };

    return (
        <form action={handleSubmit} className="space-y-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Title</label>
                    <input name="title" defaultValue={initialData?.title} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" placeholder="Enter post title..." />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Date</label>
                    <input name="date" required type="date" defaultValue={initialData?.date || new Date().toISOString().split("T")[0]} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Author</label>
                <input name="author" defaultValue={initialData?.author || "ISA"} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider">Content (Markdown)</label>
                    <div className="flex gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/mp4,video/webm" className="hidden" />
                        <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-bold text-text-subtle hover:text-accent disabled:opacity-50 transition-colors bg-surface-hover px-3 py-1.5 rounded-lg border border-border">
                            {uploading ? <FiLoader className="animate-spin" /> : <FiImage />}
                            Upload Media
                        </button>
                        <button type="button" onClick={handleEmbedVideo} className="flex items-center gap-1.5 text-xs font-bold text-text-subtle hover:text-accent transition-colors bg-surface-hover px-3 py-1.5 rounded-lg border border-border">
                            <FiVideo /> Embed Video
                        </button>
                    </div>
                </div>
                <textarea ref={contentRef} name="content" defaultValue={initialData?.content} required rows={16} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all resize-y leading-relaxed" placeholder="Write your post here... Insert images using the toolbar above!" />
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
                <button type="submit" disabled={isPending || uploading} className="bg-accent text-background px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md">
                    {isPending ? "Saving..." : (mode === "create" ? "Save Post" : "Update Post")}
                </button>
            </div>
        </form>
    );
}
