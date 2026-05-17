import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { saveGalleryImage } from "@/lib/images/process";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const galleryId = String(formData.get("galleryId") ?? "");
  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.id === galleryId);

  if (!gallery || !files.length) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const saved = await Promise.all(
    files.map(async (file) => {
      const image = await saveGalleryImage({ clientId: gallery.clientId, slug: gallery.slug, file });
      return {
        id: randomUUID(),
        galleryId: gallery.id,
        filename: image.filename,
        path: image.relativePath,
        thumbPath: image.thumbPath,
        size: image.size,
        width: image.width,
        height: image.height,
        createdAt: new Date().toISOString(),
      };
    }),
  );

  await updateDB((current) => ({
    ...current,
    galleryImages: [...current.galleryImages, ...saved],
  }));

  revalidatePath(`/admin/galleries/${gallery.id}`);
  revalidatePath(`/gallery/${gallery.slug}/view`);
  return NextResponse.json({ ok: true, images: saved.length });
}
