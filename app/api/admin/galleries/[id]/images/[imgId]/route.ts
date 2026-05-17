import { rm } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir, updateDB } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth/session";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imgId: string }> },
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, imgId } = await params;
  let imagePaths: string[] = [];

  await updateDB((db) => {
    const image = db.galleryImages.find(
      (item) => item.galleryId === id && item.id === imgId,
    );
    imagePaths = [image?.path, image?.thumbPath].filter(Boolean) as string[];

    return {
      ...db,
      galleryImages: db.galleryImages.filter((item) => item.id !== imgId),
      favorites: db.favorites.filter((favorite) => favorite.imageId !== imgId),
    };
  });

  await Promise.all(
    imagePaths.map((relativePath) =>
      rm(path.join(getUploadsDir(), relativePath), { force: true }),
    ),
  );

  return NextResponse.json({ ok: true });
}
