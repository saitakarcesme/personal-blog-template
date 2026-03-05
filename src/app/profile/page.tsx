import { BackButton } from "@/components/BackButton";
import { ProfileCard } from "@/components/ProfileCard";
import { Column } from "@/components/Column";

export default function ProfilePage() {
    return (
        <div className="min-h-dvh text-foreground">
            <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="w-full mb-8">
                    <BackButton />
                </div>
                <Column className="w-full max-w-md">
                    <ProfileCard />
                </Column>
            </main>
        </div>
    );
}
