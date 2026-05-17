import { revalidatePath } from "next/cache";
import { rm } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir, readDB, updateDB } from "@/lib/db";
import type { GalleryImage } from "@/lib/db/types";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { sanitizeImageFilename, saveGalleryImage } from "@/lib/images/process";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file

/**
 * One-file-per-request upload endpoint.
 *
 * The client is expected to POST a single file at a time so it can render
 * per-file progress, retry on failure, and run multiple uploads in parallel
 * with controlled concurrency. The legacy multi-file form is no longer used;
 * the dropzone enqueues each file separately through the global upload queue.
 */
export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const galleryId = String(formData.get("galleryId") ?? "");
  const fileEntry = formData.get("file");

  if (!galleryId || !(fileEntry instanceof File) || fileEntry.size === 0) {
    return NextResponse.json({ error: "Missing file or galleryId" }, { status: 400 });
  }

  if (fileEntry.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  if (fileEntry.type && !ALLOWED_MIME.has(fileEntry.type.toLowerCase())) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  const db = await readDB();
  const gallery = db.galleries.find((item) => item.id === galleryId);

  if (!gallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  // De-dup safeguard — same filename already in this gallery skips re-upload.
  const filename = sanitizeImageFilename(fileEntry.name);
  const existing = db.galleryImages.find(
    (img) => img.galleryId === galleryId && img.filename === filename,
  );
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true, image: existing });
  }

  const saved = await saveGalleryImage({ galleryId, file: fileEntry });
  let duplicateAfterProcessing: GalleryImage | undefined;

  const record: GalleryImage = {
    id: saved.id,
    galleryId,
    filename: saved.filename,
    // `path` stays populated so legacy readers (/api/files/<path>) keep working.
    path: saved.originalPath,
    originalPath: saved.originalPath,
    previewPath: saved.previewPath,
    size: saved.size,
    width: saved.width,
    height: saved.height,
    createdAt: new Date().toISOString(),
  };

  await updateDB((current) => {
    const duplicate = current.galleryImages.find(
      (img) => img.galleryId === galleryId && img.filename === filename,
    );
    if (duplicate) {
      duplicateAfterProcessing = duplicate;
      return current;
    }

    return {
      ...current,
      galleryImages: [...current.galleryImages, record],
    };
  });

  if (duplicateAfterProcessing) {
    await Promise.all(
      [saved.originalPath, saved.previewPath].map((relativePath) =>
        rm(path.join(getUploadsDir(), relativePath), { force: true }),
      ),
    );
    return NextResponse.json({
      ok: true,
      duplicate: true,
      image: duplicateAfterProcessing,
    });
  }

  // Refresh cached pages — galleries grid + client view both depend on this.
  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath(`/gallery/${gallery.slug}/view`);

  return NextResponse.json({ ok: true, image: record });
}
