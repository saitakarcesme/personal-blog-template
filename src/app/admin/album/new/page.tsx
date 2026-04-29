"use client";

import { useState, useTransition, useRef } from "react";
import { saveAlbumPhoto } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { FiImage, FiX, FiPlus, FiCheck } from "react-icons/fi";

export default function NewAlbumPhotoPage() {
    const [isPending, startTransition] = useTransition();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [uploadedCount, setUploadedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setSelectedFiles((prev) => [...prev, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (formData: FormData) => {
        if (selectedFiles.length === 0) return;

        const date = formData.get("date") as string;
        const description = (formData.get("description") as string) || "";

        startTransition(async () => {
            setUploadedCount(0);

            for (let i = 0; i < selectedFiles.length; i++) {
                setUploadStatus(`Uploading ${i + 1} of ${selectedFiles.length}...`);

                const singleFormData = new FormData();
                singleFormData.set("file", selectedFiles[i]);
                singleFormData.set("date", date);
                singleFormData.set("description", description);

                await saveAlbumPhoto(singleFormData);
                setUploadedCount(i + 1);
            }

            setUploadStatus("All done!");
            router.push("/admin");
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-border flex items-center justify-center text-accent">
                    <FiImage />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-main">New Photos</h1>
                    <p className="text-sm text-text-muted">Upload one or more photos to ISAlbum.</p>
                </div>
            </div>
            
            <form action={handleSubmit} className="space-y-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
                
                {/* File picker area */}
                <div>
                    <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">
                        Photos {selectedFiles.length > 0 && <span className="text-accent">({selectedFiles.length} selected)</span>}
                    </label>
                    
                    {/* Preview grid */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                            {previews.map((src, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-background">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                    {/* Show check overlay for uploaded files */}
                                    {isPending && i < uploadedCount && (
                                        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                                            <FiCheck size={24} className="text-white drop-shadow-md" />
                                        </div>
                                    )}
                                    {!isPending && (
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                        >
                                            <FiX size={12} />
                                        </button>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5 truncate px-1">
                                        {selectedFiles[i]?.name}
                                    </div>
                                </div>
                            ))}

                            {/* Add more button */}
                            {!isPending && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent/50 flex flex-col items-center justify-center gap-1 text-text-muted hover:text-accent transition-colors cursor-pointer"
                                >
                                    <FiPlus size={20} />
                                    <span className="text-[10px] font-bold">Add More</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Initial file picker */}
                    {previews.length === 0 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl py-10 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-accent transition-colors cursor-pointer"
                        >
                            <FiImage size={32} />
                            <span className="text-sm font-bold">Click to select photos</span>
                            <span className="text-xs">You can select multiple files at once</span>
                        </button>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesSelected}
                        className="hidden"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Date</label>
                        <input name="date" required type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Description (Optional)</label>
                        <input name="description" placeholder="A short description..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-main transition-all" />
                    </div>
                </div>

                {/* Progress bar */}
                {isPending && selectedFiles.length > 0 && (
                    <div className="space-y-2">
                        <div className="w-full bg-background rounded-full h-2 border border-border overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(uploadedCount / selectedFiles.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-accent font-medium text-center animate-pulse">{uploadStatus}</p>
                    </div>
                )}

                <div className="pt-6 border-t border-border flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={isPending || selectedFiles.length === 0}
                        className="bg-accent text-background px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
                    >
                        {isPending
                            ? `Uploading ${uploadedCount}/${selectedFiles.length}...`
                            : `Add ${selectedFiles.length || 0} Photo${selectedFiles.length !== 1 ? "s" : ""} to Album`}
                    </button>
                </div>
            </form>
        </div>
    );
}
