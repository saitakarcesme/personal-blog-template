"use client";

import PostEditor from "@/components/PostEditor";
import { FiEdit3 } from "react-icons/fi";

export default function NewPostPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent">
                    <FiEdit3 />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-main">New Blog Post</h1>
                    <p className="text-sm text-text-muted">Write and save a markdown post locally.</p>
                </div>
            </div>
            
            <PostEditor mode="create" />
        </div>
    );
}
