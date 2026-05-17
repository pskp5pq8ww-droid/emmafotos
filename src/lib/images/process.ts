import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getUploadsDir } from "@/lib/db";

const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function sanitizeExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (ALLOWED_EXTS.has(ext)) return ext;
  return ".jpg";
}

function sanitizeBaseName(filename: string) {
  const ext = path.extname(filename);
  return path
    .basename(filename, ext)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64) || "image";
}

export function sanitizeImageFilename(filename: string) {
  return `${sanitizeBaseName(filename)}${sanitizeExt(filename)}`;
}

export type SavedImage = {
  /** UUID — caller stores this as GalleryImage.id */
  id: string;
  /** Cleaned-up original filename (for display + ZIP entry name) */
  filename: string;
  /** Relative path to the high-quality original on disk (under UPLOAD_DIR) */
  originalPath: string;
  /** Relative path to the optimized WebP preview on disk (under UPLOAD_DIR) */
  previewPath: string;
  size: number;
  width: number;
  height: number;
};

/**
 * Persists a gallery image using the canonical structure:
 *   UPLOAD_DIR/galleries/{galleryId}/originals/{imageId}{ext}
 *   UPLOAD_DIR/galleries/{galleryId}/previews/{imageId}.webp
 *
 * Returns BOTH original and preview paths so callers can store them in the DB.
 * Old `path` / `thumbPath` fields remain for back-compat with already-uploaded
 * photos; new uploads should use `originalPath` / `previewPath`.
 */
export async function saveGalleryImage({
  galleryId,
  file,
}: {
  galleryId: string;
  file: File;
}): Promise<SavedImage> {
  const ext = sanitizeExt(file.name);
  const id = randomUUID();
  const displayFilename = sanitizeImageFilename(file.name);

  const uploadsRoot = getUploadsDir();
  const originalsDir = path.join(uploadsRoot, "galleries", galleryId, "originals");
  const previewsDir = path.join(uploadsRoot, "galleries", galleryId, "previews");
  await mkdir(originalsDir, { recursive: true });
  await mkdir(previewsDir, { recursive: true });

  const originalAbs = path.join(originalsDir, `${id}${ext}`);
  const previewAbs = path.join(previewsDir, `${id}.webp`);

  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();

  // Write the lossless original exactly as uploaded.
  await writeFile(originalAbs, buffer);

  // Generate the WebP preview: respects EXIF rotation, max 1400px on long
  // edge, q80 — good balance of visual quality and file size for browser
  // display. effort=2 trades a small file-size penalty for much faster encode
  // (matters on shared Hostinger CPU when uploading dozens of photos).
  await sharp(buffer)
    .rotate()
    .resize({
      width: 1400,
      height: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 2 })
    .toFile(previewAbs);

  return {
    id,
    filename: displayFilename,
    originalPath: path.posix.join("galleries", galleryId, "originals", `${id}${ext}`),
    previewPath: path.posix.join("galleries", galleryId, "previews", `${id}.webp`),
    size: buffer.byteLength,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}
