"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface Props {
    /** The hidden <input name={name}> submitted with the form */
    name: string;
    /** Existing image URL (pre-fills the uploader) */
    defaultUrl?: string;
    /** Sub-folder inside the storage bucket, e.g. "logos", "services", "gallery" */
    folder?: string;
    /** CSS aspect-ratio value, e.g. "1/1", "16/9", "4/3" */
    aspectRatio?: string;
    label?: string;
}

export function ImageUploader({
    name,
    defaultUrl = "",
    folder = "uploads",
    aspectRatio = "16/9",
    label = "image",
}: Props) {
    const [url, setUrl] = useState(defaultUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const upload = async (file: File) => {
        setUploading(true);
        setError(null);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error ?? "Upload failed. Please try again.");
            } else {
                setUrl(data.url);
            }
        } catch {
            setError("Network error. Check your connection.");
        } finally {
            setUploading(false);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be under 5 MB.");
            return;
        }
        upload(file);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, []);

    return (
        <div className="space-y-2">
            {/* Hidden input carries the URL into the form */}
            <input type="hidden" name={name} value={url} />

            {url ? (
                /* ── Preview ─────────────────────────────────────────────── */
                <div
                    className="relative rounded-xl overflow-hidden border bg-muted"
                    style={{ aspectRatio }}
                >
                    <Image src={url} alt={label} fill className="object-cover" unoptimized />

                    {/* Remove */}
                    <button
                        type="button"
                        onClick={() => setUrl("")}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
                        title="Remove image"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Replace */}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors z-10 flex items-center gap-1.5"
                    >
                        <Upload className="w-3 h-3" /> Replace
                    </button>
                </div>
            ) : (
                /* ── Drop zone ───────────────────────────────────────────── */
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer p-8
                        ${dragOver
                            ? "border-business-primary bg-business-primary/5"
                            : "border-muted-foreground/25 hover:border-business-primary/50 hover:bg-muted/30"
                        }`}
                    style={{ aspectRatio }}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-business-primary" />
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-business-primary/10 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-business-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm">Click or drag & drop</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPEG, PNG, WebP · max 5 MB
                                </p>
                            </div>
                        </>
                    )}
                </button>
            )}

            {/* Upload spinner overlay when replacing */}
            {uploading && url && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                    {error}
                </p>
            )}

            {/* Hidden file input */}
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={onInputChange}
            />
        </div>
    );
}
