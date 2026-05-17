import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getUploadsDir } from "@/lib/db";

function safeFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase() || ".jpg";
  const base = path
    .basename(filename, extension)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  return `${base || "image"}-${Date.now()}${extension}`;
}

export async function saveGalleryImage({
  slug,
  file,
}: {
  slug: string;
  file: File;
}) {
  const uploadsRoot = getUploadsDir();
  const galleryDir = path.join(uploadsRoot, "galleries", slug);
  const thumbsDir = path.join(galleryDir, "thumbs");
  await mkdir(thumbsDir, { recursive: true });

  const filename = safeFilename(file.name);
  const originalPath = path.join(galleryDir, filename);
  const thumbPath = path.join(thumbsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();

  await writeFile(originalPath, buffer);
  await sharp(buffer)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(thumbPath);

  return {
    filename,
    relativePath: path.posix.join("galleries", slug, filename),
    thumbPath: path.posix.join("galleries", slug, "thumbs", filename),
    size: buffer.byteLength,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}
