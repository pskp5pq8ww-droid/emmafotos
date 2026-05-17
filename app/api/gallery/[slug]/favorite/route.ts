import { NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { hasGallerySession } from "@/lib/gallery-auth/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = (await request.json()) as { imageId?: string };
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);

  if (!gallery || !(await hasGallerySession(slug, gallery.clientId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const image = db.galleryImages.find(
    (item) => item.galleryId === gallery.id && item.id === body.imageId,
  );

  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let favorite = false;

  await updateDB((current) => {
    const exists = current.favorites.some(
      (item) => item.galleryId === gallery.id && item.imageId === image.id,
    );

    favorite = !exists;

    return {
      ...current,
      favorites: exists
        ? current.favorites.filter(
            (item) => !(item.galleryId === gallery.id && item.imageId === image.id),
          )
        : [
            ...current.favorites,
            {
              galleryId: gallery.id,
              imageId: image.id,
              createdAt: new Date().toISOString(),
            },
          ],
    };
  });

  return NextResponse.json({ favorite });
}
