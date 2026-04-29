"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { getAlbumPhotos, deleteAlbumPhoto, saveAlbumPhoto } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { FiImage, FiTrash2, FiPlus, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

type Photo = { id: string; url: string; date: string; description: string };

export default function EditAlbumPage() {
    const [isPending, startTransition] = useTransition();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [uploadingCount, setUploadingCount] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const loadPhotos = () => {
        startTransition(async () => {
            const data = await getAlbumPhotos();
            setPhotos(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = (id: string) => {
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            return;
        }

        setDeletingId(id);
        setConfirmDeleteId(null);

        startTransition(async () => {
            await deleteAlbumPhoto(id);
            setPhotos((prev) => prev.filter((p) => p.id !== id));
            setDeletingId(null);
        });
    };

    const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const date = new Date().toISOString().split("T")[0];

        startTransition(async () => {
            setUploadingCount(files.length);
            setUploadedCount(0);

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.set("file", files[i]);
                formData.set("date", date);
                formData.set("description", "");
                await saveAlbumPhoto(formData);
                setUploadedCount(i + 1);
            }

            setUploadingCount(0);
            setUploadedCount(0);
            // Reload photos
            const data = await getAlbumPhotos();
            setPhotos(data);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/50 transition-colors"
                    >
                        <FiArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-text-main">Edit Album</h1>
                        <p className="text-sm text-text-muted">{photos.length} photos in ISAlbum</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 bg-accent text-background px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
                    >
                        <FiPlus size={16} />
                        Add Photos
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddPhotos}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Upload progress */}
            {uploadingCount > 0 && (
                <div className="mb-6 bg-surface border border-border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">Uploading photos...</span>
                        <span className="text-accent font-bold">{uploadedCount}/{uploadingCount}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 border border-border overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(uploadedCount / uploadingCount) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty state */}
            {!loading && photos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                    <FiImage size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-serif font-bold">No photos yet</p>
                    <p className="text-sm mt-1">Click &quot;Add Photos&quot; to get started.</p>
                </div>
            )}

            {/* Photo grid */}
            {!loading && photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`group relative aspect-square rounded-xl overflow-hidden border bg-background transition-all duration-300 ${
                                deletingId === photo.id
                                    ? "border-red-500/50 opacity-50 scale-95"
                                    : confirmDeleteId === photo.id
                                    ? "border-red-500/50 ring-2 ring-red-500/20"
                                    : "border-border hover:border-accent/30"
                            }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo.url}
                                alt={photo.description || `Photo from ${photo.date}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Hover overlay with info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-3">
                                <span className="text-xs font-bold text-white drop-shadow-md">{photo.date}</span>
                                {photo.description && (
                                    <span className="text-[10px] text-white/80 truncate mt-0.5">{photo.description}</span>
                                )}
                            </div>

                            {/* Delete button */}
                            {confirmDeleteId === photo.id ? (
                                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(photo.id)}
                                        disabled={isPending}
                                        className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        title="Confirm delete"
                                    >
                                        <FiCheck size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="w-7 h-7 rounded-full bg-surface text-text-muted flex items-center justify-center shadow-md hover:text-text-main border border-border transition-colors"
                                        title="Cancel"
                                    >
                                        <FiX size={13} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(photo.id)}
                                    disabled={isPending}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 disabled:opacity-50"
                                    title="Delete photo"
                                >
                                    <FiTrash2 size={13} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
