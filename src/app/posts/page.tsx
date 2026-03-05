import { BackButton } from "@/components/BackButton";
import { BlogList } from "@/components/BlogList";
import { getAllPosts } from "@/lib/posts";
import { Column } from "@/components/Column";

export default function PostsPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-dvh text-foreground">
            <main className="mx-auto max-w-3xl px-4 pt-24 pb-10 min-[1300px]:py-10 sm:px-6 lg:px-8">
                <BackButton />
                <header className="mt-8 mb-8">
                    <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                        All Posts
                    </h1>
                </header>
                <Column className="min-h-0">
                    <BlogList posts={posts} />
                </Column>
            </main>
        </div>
    );
}
