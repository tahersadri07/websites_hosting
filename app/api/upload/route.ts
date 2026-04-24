import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "business-assets";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(request: NextRequest) {
    // 1. Auth check — only logged-in admins can upload
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse multipart form
    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "uploads").replace(/[^a-z0-9-_]/gi, "");

    if (!file || file.size === 0) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
            { error: "Only JPEG, PNG, WebP, GIF and SVG images are allowed" },
            { status: 400 }
        );
    }

    // 4. Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
            { error: `File must be under ${MAX_SIZE_MB}MB` },
            { status: 400 }
        );
    }

    const serviceClient = createServiceClient();

    // 5. Ensure the bucket exists (safe to call repeatedly — no-ops if already exists)
    await serviceClient.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_SIZE_MB * 1024 * 1024,
        allowedMimeTypes: ALLOWED_TYPES,
    }).catch(() => {/* bucket already exists — ignore */});

    // 6. Build a unique path
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = `${folder}/${unique}.${ext}`;

    // 7. Upload
    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await serviceClient.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 8. Return public URL
    const { data: { publicUrl } } = serviceClient.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: publicUrl });
}
