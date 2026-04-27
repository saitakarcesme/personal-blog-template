import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { FiEdit2, FiPlus } from "react-icons/fi";

export default function AdminPostsPage() {
    const posts = getAllPosts();

    return (
        <div className="max-w-4xl mx-auto pt-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-main">Manage Posts</h1>
                    <p className="text-sm text-text-muted mt-1">Edit or delete existing blog posts.</p>
                </div>
                <Link href="/admin/posts/new" className="bg-accent text-background px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                    <FiPlus /> New Post
                </Link>
            </div>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-surface-hover/50 text-text-subtle font-bold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {posts.map((post) => (
                            <tr key={post.slug} className="hover:bg-surface-hover/30 transition-colors">
                                <td className="px-6 py-4 font-serif font-medium text-text-main">{post.title}</td>
                                <td className="px-6 py-4 text-text-muted">{post.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/posts/edit/${post.slug}`} className="inline-flex items-center justify-center p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors">
                                        <FiEdit2 />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-text-muted">No posts found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
