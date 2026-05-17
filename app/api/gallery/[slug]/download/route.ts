import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir, readDB } from "@/lib/db";
import { createZip } from "@/lib/files/zip";
import { hasGallerySession } from "@/lib/gallery-auth/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);

  if (!gallery || !(await hasGallerySession(slug, gallery.clientId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = db.galleryImages.filter((image) => image.galleryId === gallery.id);

  if (!images.length) {
    return NextResponse.json({ error: "No images" }, { status: 404 });
  }

  const zip = await createZip(
    images.map((image) => ({
      absolutePath: path.join(getUploadsDir(), image.path),
      filename: image.filename,
    })),
  );

  return new NextResponse(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${gallery.slug}.zip"`,
      "Content-Length": String(zip.byteLength),
    },
  });
}
