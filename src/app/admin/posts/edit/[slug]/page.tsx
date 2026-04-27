import PostEditor from "@/components/PostEditor";
import { FiEdit2 } from "react-icons/fi";
import { getPostDetail } from "@/lib/posts";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// We can't reuse getPostDetail entirely as it parses HTML, we need the raw content to edit.
async function getRawPostContent(slug: string) {
    const postsDir = path.join(process.cwd(), "data", "posts");
    const fullPath = path.join(postsDir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const file = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(file);

    return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "1970-01-01",
        author: data.author ?? "ISA",
        content: content.trim(),
    };
}

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const postData = await getRawPostContent(slug);

    if (!postData) {
        return <div className="text-center mt-10">Post not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent">
                    <FiEdit2 />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-main">Edit Blog Post</h1>
                    <p className="text-sm text-text-muted">Modify existing markdown post locally.</p>
                </div>
            </div>
            
            <PostEditor mode="edit" initialData={postData} />
        </div>
    );
}
